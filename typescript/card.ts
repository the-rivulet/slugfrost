import { game, getId, hasAttack, hasCondition, hasCounter, log, Player, ui } from "./game.js";
import type { Ability, Effect } from "./ability.js";
import type { Charm } from "./charm.js";
import { HitAction, FindTargetsAction, SummonUnitAction, TriggerAction, FinishedPlayingAction, DieAction, TempModifyCounterAction } from "./action.js";

export abstract class Card {
  owner?: Player;
  abstract name: string;
  abstract id: string;
  text = "";
  abilities: Ability[] = [];
  baseEffects: Effect[] = [];
  curEffects: Effect[] = [];
  charms: Charm[] = [];
  crowned = false;
  isLeader = false;
  frenzy = 1;
  element?: HTMLDivElement;
  constructor(owner: Player, addToDeck = true, addToHand = false) {
    this.owner = owner;
    if(addToDeck) {
      owner.deckpack.push(this);
      if(!addToHand) owner.drawPile.push(this);
    }
    if(addToHand) {
      this.createElement();
      owner.hand.unshift(this);
      owner.updateHand();
    }
  }
  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("card");
    this.element.style.opacity = "0";
    this.element.onmousedown = (e) => {
      if(ui.currentlyPlaying instanceof ItemCard && ((this instanceof UnitCard && this.fieldPos) || ui.currentlyPlaying.canHitHand) && (!hasCondition(ui.currentlyPlaying) || ui.currentlyPlaying.condition(this))) {
        if(game.resolving) return;
        ui.currentlyPlaying.play(this);
        ui.deselect();
        game.endTurn();
        return;
      }
      if(ui.currentlyPlaying == this) {
        ui.deselect();
      } else if(this.owner.side == 0) { // only p0's cards can be selected
        ui.deselect();
        ui.currentlyPlaying = this;
        this.element.classList.add("currentlyPlaying");
      }
    }
    getId("hand").appendChild(this.element);
  }
  updateElement() {
    if(!this.element) this.createElement();
    if(this.isLeader) this.element.classList.add("leader");
    if([`slugfrost.bigPeng`].includes(this.id)) this.element.classList.add("boss");
    this.element.innerHTML = this.name + "<br/>" + (this.abilities.map(x => x.text).join("<br/>") || this.text);
    if(hasAttack(this)) {
      let el = Array.from(this.element.children).find(x => x.classList.contains("base-attack"));
      if(!el) {
        el = document.createElement("div");
        el.classList.add("base-attack", "cardright");
        this.element.appendChild(el);
      }
      el.innerHTML = "<span style='color:skyblue'>" + this.curAttack + "</span>";
    }
    for(let effect of this.curEffects) {
      let el = Array.from(this.element.children).find(x => x.classList.contains(effect.id.replace(".", "-"))) as HTMLElement;
      if(!el) {
        el = document.createElement("div");
        el.classList.add(effect.id.replace(".", "-"), "card" + effect.side);
        this.element.appendChild(el);
      }
      el.style.top = Array.from(this.element.children).filter(x => x.classList.contains("card" + effect.side)).length * 20 + "px";
      el.innerHTML = "<span style='color:" + effect.color + "'>" + effect.amount + "</span>";
    }
    if(this.frenzy > 1) {
      let el = Array.from(this.element.children).find(x => x.classList.contains("base-frenzy")) as HTMLElement;
      if(!el) {
        el = document.createElement("div");
        el.classList.add("base-frenzy", "cardbottom");
        this.element.appendChild(el);
      }
      el.style.bottom = Array.from(this.element.children).filter(x => x.classList.contains("cardbottom")).length * 20 + "px";
      el.innerHTML = "<span style='color:orange'>{×" + this.frenzy + "}</span>";
    }
    if(this.abilities.find(x => x.isReaction)) {
      let el = Array.from(this.element.children).find(x => x.classList.contains("base-reaction")) as HTMLElement;
      if(!el) {
        el = document.createElement("div");
        el.classList.add("base-reaction", "cardbottom");
        this.element.appendChild(el);
      }
      el.style.bottom = Array.from(this.element.children).filter(x => x.classList.contains("cardbottom")).length * 20 + "px";
      el.innerHTML = "<span style='color:" + this.curEffects.find(x => x.id == `base.snow`) ? "#77f" : "orange" + "'>{!}</span>";
    }
  }
  init() {
    if(hasAttack(this)) this.curAttack = this.baseAttack;
    this.updateElement();
  }
  dance() { /* Do nothing. Non-Unit cards can't dance. */ }
  flash(color: string) {
    this.element.style.background = color;
    setTimeout(() => { this.element.style.background = ""; }, 300);
  }
}

interface FieldPos {
  side: number;
  row: number;
  column: number;
}

export abstract class ItemCard extends Card {
  get canHitHand() { return !hasAttack(this) && !this.abilities.find(x => x.id.includes(".targeting.")); }
  play(target: Card) {
    if((target instanceof UnitCard && !target.fieldPos && !this.canHitHand) || (hasCondition(this) && !this.condition(target))) {
      log("cannot play " + this.name + " on card " + target.name);
      return false;
    }
    // will be discarded when it resolves
    new FinishedPlayingAction(this).stack();
    for(let i = 0; i < this.frenzy; i++) {
      new FindTargetsAction(this, target).onEach(x => new HitAction(this, x).stack());
      new TriggerAction(this).stack();
    }
    return true;
  }
}

export abstract class UnitCard extends Card {
  abstract takeDamage(amount: number): void;
  fieldPos?: FieldPos;
  init() {
    if(hasCounter(this)) this.curCounter = this.baseCounter;
    super.init();
  }
  summon(row: number, col: number) {
    let on = game.cardsByPos(this.owner.side, row, col)[0];
    if(!on) {
      while(!game.cardsByPos(this.owner.side, row, col - 1).length && col > 0) col--;
    } else if(col < 2 && !game.cardsByPos(this.owner.side, row, col + 1).length) {
      on.fieldPos.column++;
      on.element.style.left = getId(`slot-${this.owner.side}-${col + 1}-${row}`).offsetLeft + getId(`slot-${this.owner.side}-${col + 1}-${row}`).offsetWidth * 0.25 + "px";
    } else return false;
    this.fieldPos = {side: this.owner.side, row: row, column: col};
    game.battlefield.push(this);
    let slot = getId(`slot-${this.owner.side}-${col}-${row}`);
    this.element.style.bottom = "calc(100% - " + (slot.offsetTop + slot.offsetHeight * 0.75) + "px)";
    this.element.style.left = slot.offsetLeft + slot.offsetWidth * 0.25 + "px";
    this.element.style.opacity = "1";
    ui.deselect();
    if(this.owner.hand.includes(this)) {
      this.owner.hand.splice(this.owner.hand.indexOf(this), 1);
      this.owner.updateHand();
    }
    new SummonUnitAction(this, this.owner.side, row, col).stack();
    return true;
  }
  die() {
    new DieAction(this).stack();
  }
  recall() {
    game.battlefield.splice(game.battlefield.indexOf(this), 1);
    // move other cards forward
    for(let col = this.fieldPos.column + 1; col <= 2; col++) {
      let on = game.cardsByPos(this.fieldPos.side, this.fieldPos.row, col)[0];
      if(!on) break;
      on.fieldPos.column--;
      on.element.style.left = getId(`slot-${this.owner.side}-${col - 1}-${this.fieldPos.row}`).offsetLeft + "px";
    }
    this.fieldPos = undefined;
    this.owner.discardPile.push(this);
    this.element.style.left = "calc(100% - " + this.element.offsetWidth + "px)";
    this.element.style.opacity = "0";
  }
  dance() {
    let oldStyle = this.element.style.left, oldPos = this.element.offsetLeft;
    this.element.style.left = oldPos + 20 + "px";
    setTimeout(() => { this.element.style.left = oldPos - 20 + "px"; }, 200);
    setTimeout(() => { this.element.style.left = oldStyle; }, 400);
  }
  danceHurt() {
    let oldStyle = this.element.style.bottom, oldPos = this.element.offsetTop + this.element.offsetHeight;
    this.element.style.bottom = "calc(100% - " + (oldPos + 20) + "px)";
    setTimeout(() => { this.element.style.bottom = oldStyle; }, 400);
  }
  tickDown(amount = -1) { if(hasCounter(this)) new TempModifyCounterAction(this, amount).stack(); }
  trigger(forceTarget?: UnitCard) {
    for(let i = 0; i < this.frenzy; i++) {
      if(hasAttack(this)) {
        let firstTarget = forceTarget || (game.cardsByPos(this.fieldPos.side == 0 ? 1 : 0, this.fieldPos.row)[0] ?? game.cardsByPos(this.fieldPos.side == 0 ? 1 : 0)[0]);
        if(firstTarget) new FindTargetsAction(this, firstTarget).onEach(x => new HitAction(this, x).stack());
        else log(this.name + " has no targets!");
      }
      new TriggerAction(this).stack();
    }
  }
  updateElement() {
    super.updateElement();
    if(hasCounter(this)) {
      let el = Array.from(this.element.children).find(x => x.classList.contains("base-counter"));
      if(!el) {
        el = document.createElement("div");
        el.classList.add("base-counter", "cardbottom");
        this.element.appendChild(el);
      }
      el.innerHTML = "<span style='color:" + (this.curEffects.find(x => x.id == `base.snow`) ? "gray" : this.curCounter == 1 ? "red" : "gold") + "'>" + this.curCounter + "</span>";
    }
  }
}

export abstract class CompanionCard extends UnitCard {
  abstract baseHealth: number;
  maxHealth: number;
  curHealth: number;
  injured = false;
  takeDamage(amount: number) {
    this.curHealth -= amount;
    this.updateElement();
    if(this.curHealth <= 0) this.die();
    else this.danceHurt();
  }
  updateElement() {
    super.updateElement();
    let el = Array.from(this.element.children).find(x => x.classList.contains("base-health"));
    if(!el) {
      el = document.createElement("div");
      el.classList.add("base-health", "cardleft");
      this.element.appendChild(el);
    }
    el.innerHTML = "<span style='color:salmon'>" + this.curHealth + "</span>";
  }
  init() {
    this.maxHealth = this.baseHealth;
    if(this.injured) this.curHealth = Math.floor(0.5 * this.baseHealth);
    else this.curHealth = this.baseHealth;
    super.init();
  }
}

export abstract class ClunkerCard extends UnitCard {
  abstract baseScrap: number;
  curScrap: number;
  takeDamage(amount: number) {
    if(amount > 0) { this.curScrap--; this.updateElement(); }
    if(this.curScrap <= 0) this.die();
    else this.danceHurt();
  }
  updateElement() {
    super.updateElement();
    let el = Array.from(this.element.children).find(x => x.classList.contains("base-scrap"));
    if(!el) {
      el = document.createElement("div");
      el.classList.add("base-scrap", "cardleft");
      this.element.appendChild(el);
    }
    el.innerHTML = " <span style='color:#733'>" + this.curScrap + "</span>";
  }
  init() {
    this.curScrap = this.baseScrap;
    super.init();
  }
}