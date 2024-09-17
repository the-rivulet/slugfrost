import type { Ability, Effect } from "./ability.js";
import type { Card, CompanionCard, ItemCard, UnitCard } from "./card.js";
import { game, log, HasAttack, HasCounter, Side, hasAttack, getId, Player, ui } from "./game.js";

export abstract class Action<T = void> {
  abstract id: string;
  abstract run(): T;
  execute() { try {
    // Look for abilities.
    for(let i of game.cardsByPos()) {
      for(let j of i.abilities) {
        // special case to halt reactions on snow
        if(!i.curEffects.map(x => x.id).includes("base.snow") || !j.isReaction) j.use(this);
      }
      for(let k of i.curEffects) {
        k.use(this);
      }
    }
    for(let p of game.players) {
      for(let i of p.hand) {
        for(let j of i.abilities) {
          // special case to halt reactions on snow
          if(!i.curEffects.map(x => x.id).includes("base.snow") || !j.isReaction) j.use(this);
        }
        for(let k of i.curEffects) {
          k.use(this);
        }
      }
    }
    log("=".repeat(game.actionStack.length) + "> Running: " + this.id);
    return this.run();
  } catch(e) {log("Error in " + this.id + "'s execution: " + e);} }
  stack() {
    log("=".repeat(game.actionStack.length) + "> Stacking: " + this.id);
    game.actionStack.push(this);
  }
  queue() {
    log("=".repeat(game.actionStack.length) + "> Queueing: " + this.id);
    game.actionStack.unshift(this);
  }
}

export class TriggerAction extends Action {
  id = `base.trigger`;
  card: Card;
  isFirst: boolean;
  constructor(card: Card, isFirst: boolean) {
    super();
    this.card = card;
    this.isFirst = isFirst;
  }
  run() {
    // no effects, except...
    this.card.dance();
  }
}

export class FinishedPlayingAction extends Action {
  id = `base.finishedPlaying`;
  card: ItemCard;
  constructor(card: ItemCard) {
    super();
    this.card = card;
  }
  run() {
    if(this.card.owner.hand.includes(this.card)) {
      if(this.card.abilities.find(x => x.id == `base.consume`)) this.card.owner.exile(this.card);
      else this.card.owner.discard(this.card);
    }
  }
}

export class FindTargetsAction extends Action<Card[]> {
  id = `base.findTargets`;
  source: Card;
  targets: Card[];
  random = 0;
  constructor(source: Card, firstTarget: Card, random = 0) {
    super();
    this.source = source;
    this.targets = [firstTarget];
    this.random = random;
  }
  run() {
    return this.targets;
  }
  onEach(func: (card: Card) => void) {
    this.execute().forEach(func);
  }
}

export class GetDisplayedAttackAction extends Action<number> {
  id = `base.getDisplayedAttack`;
  card: HasAttack;
  amount: number;
  constructor(card: HasAttack, amount: number) {
    super();
    this.card = card;
    this.amount = amount;
  }
  run() {
    return this.amount;
  }
}

export class TakeDamageAction extends Action {
  id = `base.takeDamage`;
  target: UnitCard;
  amount: number;
  source: Ability | Card;
  constructor(target: UnitCard, amount: number, source: Ability | Card) {
    super();
    this.target = target;
    this.amount = amount;
    this.source = source;
  }
  run() {
    log("p" + this.target.owner.side + "'s " + this.target.name + " took " + this.amount + " damage");
    this.target.takeDamage(Math.max(0, this.amount), this.source);
  }
}

export class HitAction extends Action {
  id = `base.hit`;
  source: Card;
  target: Card;
  amount: number;
  isAttack: boolean;
  constructor(source: Card, target: Card) {
    super();
    this.source = source;
    this.target = target;
    this.amount = hasAttack(source) ? Math.max(0, source.curAttack) : 0;
    this.isAttack = hasAttack(source);
  }
  execute() {
    if(this.isAttack && !((this.target as UnitCard).fieldPos) && (this.source as UnitCard).fieldPos) {
      this.target = (game.cardsByPos((this.source as UnitCard).fieldPos.side == 0 ? 1 : 0, (this.source as UnitCard).fieldPos.row)[0] ?? game.cardsByPos((this.source as UnitCard).fieldPos.side == 0 ? 1 : 0)[0]);
      if(!this.target) {
        log("But there was no target!");
        return;
      }
    }
    super.execute();
  }
  run() {
    log("p" + this.source.owner.side + "'s " + this.source.name + " hit p" + this.target.owner.side + "'s " + this.target.name + (this.isAttack ? " for " + this.amount + " damage" : ""));
    if(this.isAttack && game.battlefield.includes(this.target as UnitCard)) new TakeDamageAction(this.target as UnitCard, this.amount, this.source).stack();
  }
}

export class DealDamageAction extends Action {
  id = `base.dealDamage`;
  source: Ability;
  target: UnitCard;
  amount: number;
  constructor(source: Ability, target: UnitCard, amount: number) {
    super();
    this.source = source;
    this.target = target;
    this.amount = amount;
  }
  run() {
    log(this.source.id + " on p" + this.source.owner.owner.side + "'s " + this.source.owner.name + " damaged p" + this.target.owner.side + "'s " + this.target.name + " for " + this.amount + " damage");
    if(game.battlefield.includes(this.target)) new TakeDamageAction(this.target, this.amount, this.source).stack();
  }
}

export class SummonUnitAction extends Action {
  id = `base.summonUnit`;
  card: UnitCard;
  side: number;
  row: number;
  column: number;
  constructor(card: UnitCard, side: number, row: number, column: number) {
    super();
    this.card = card;
    this.side = side;
    this.row = row;
    this.column = column;
  }
  run() {
    log("p" + this.card.owner.side + " summoned " + this.card.name);
    this.card.fieldPos = {side: this.side, row: this.row, column: this.column};
    game.battlefield.push(this.card);
    let slot = getId(`slot-${this.side}-${this.column}-${this.row}`);
    this.card.element.style.bottom = "calc(100% - " + (slot.offsetTop + slot.offsetHeight * 0.75) + "px)";
    this.card.element.style.left = slot.offsetLeft + slot.offsetWidth * 0.25 + "px";
    this.card.element.style.opacity = "1";
    ui.deselect();
    if(this.card.owner.hand.includes(this.card)) {
      this.card.owner.hand.splice(this.card.owner.hand.indexOf(this.card), 1);
      this.card.owner.updateHand();
    }
    // for `WhileActiveAddAttackToAlliesAbility`
    for(let i of game.battlefield) i.updateElement();
  }
}

export class ApplyEffectAction extends Action {
  id = `base.applyEffect`;
  source: Ability;
  target: UnitCard;
  makeEffect: (target: UnitCard) => Effect;
  _makeEffect: (target: UnitCard) => Effect;
  constructor(source: Ability, target: UnitCard, makeEffect: (target: UnitCard) => Effect) {
    super();
    this.source = source;
    this.target = target;
    this.makeEffect = makeEffect;
    this._makeEffect = makeEffect;
  }
  run() {
    let effect = this._makeEffect(this.target);
    log(this.source.id + " on p" + this.source.owner.owner.side + "'s " + this.source.owner.name + " applied " + effect.amount + " " + effect.name + " to p" + this.target.owner.side + "'s " + this.target.name);
    let exists = this.target.curEffects.find(x => x.id == effect.id);
    if(exists) {
      exists.lastAppliedBy = this.source;
      exists.amount = Math.max(0, exists.amount + effect.amount);
      log(this.target.name + "'s " + effect.name + " is now " + exists.amount);
      if(exists.amount == 0) this.target.curEffects.splice(this.target.curEffects.indexOf(exists), 1);
    } else if(effect.amount > 0) {
      effect.lastAppliedBy = this.source;
      this.target.curEffects.push(effect);
    }
    this.target.updateElement();
    this.target.flash(effect.color);
  }
}

export class TempModifyCounterAction extends Action {
  id = `base.tempModifyCounter`;
  target: HasCounter;
  amount: number;
  constructor(target: HasCounter, amount: number) {
    super();
    this.target = target;
    this.amount = amount;
  }
  run() {
    if(!this.target.fieldPos) return;
    this.target.curCounter += this.amount;
    if(this.target.curCounter <= 0) {
      this.target.trigger();
      this.target.curCounter = this.target.baseCounter;
    }
    this.target.updateElement();
    this.target.flash("gold");
  }
}

export class ModifyMaxCounterAction extends Action {
  id = `base.modifyMaxCounter`;
  target: HasCounter;
  amount: number;
  constructor(target: HasCounter, amount: number) {
    super();
    this.target = target;
    this.amount = amount;
  }
  run() {
    this.target.curCounter += this.amount;
    this.target.maxCounter = Math.max(1, this.target.baseCounter + this.amount);
    if(this.target.curCounter <= 0) {
      this.target.trigger();
      this.target.curCounter = this.target.baseCounter;
    }
    this.target.updateElement();
    this.target.flash("gold");
  }
}

export class ModifyAttackAction extends Action {
  id = `base.modifyAttack`;
  target: HasAttack;
  amount: number;
  constructor(target: HasAttack, amount: number) {
    super();
    this.target = target;
    this.amount = amount;
  }
  run() {
    this.target.curAttack += this.amount;
    this.target.updateElement();
    this.target.flash("skyblue");
  }
}

export class RestoreAction extends Action {
  id = `base.restore`;
  target: CompanionCard;
  amount: number;
  source: Ability;
  constructor(target: CompanionCard, amount: number, source: Ability) {
    super();
    this.target = target;
    this.amount = amount;
    this.source = source;
  }
  run() {
    this.target.curHealth = Math.min(this.target.maxHealth, this.target.curHealth + this.amount);
    if(this.target.curHealth <= 0) this.target.takeDamage(0, this.source);
    this.target.updateElement();
    this.target.flash("salmon");
  }
}

export class ModifyMaxHealthAction extends Action {
  id = `base.modifyMaxHealth`;
  target: CompanionCard;
  amount: number;
  source: Ability;
  constructor(target: CompanionCard, amount: number, source: Ability) {
    super();
    this.target = target;
    this.amount = amount;
    this.source = source;
  }
  run() {
    this.target.maxHealth += this.amount;
    this.target.curHealth += this.amount;
    if(this.target.curHealth <= 0) this.target.takeDamage(0, this.source);
    this.target.updateElement();
    this.target.flash("salmon");
  }
}

export class DieAction extends Action {
  id = `base.die`;
  card: UnitCard;
  source: Ability | Card;
  constructor(card: UnitCard, source: Ability | Card) {
    super();
    this.card = card;
    this.source = source;
  }
  run() {
    game.battlefield.splice(game.battlefield.indexOf(this.card), 1);
    // move other cards forward
    for(let col = this.card.fieldPos.column + 1; col <= 2; col++) {
      let on = game.cardsByPos(this.card.fieldPos.side, this.card.fieldPos.row, col)[0];
      if(!on) break;
      on.fieldPos.column--;
      let el = getId(`slot-${this.card.owner.side}-${col - 1}-${this.card.fieldPos.row}`);
      on.element.style.left = el.offsetLeft + el.offsetWidth * 0.25 + "px";
    }
    this.card.fieldPos = undefined;
    this.card.owner.exile(this.card);
    if(ui.currentlyPlaying == this.card) ui.deselect();
    log("p" + this.card.owner.side + "'s " + this.card.name + " died");
    if(this.card.isLeader) {
      alert("DEFEAT - Leader died");
      log("DEFEAT - Leader died");
    }
    if(this.card.owner.side == 1) { // enemy side
      game.players[0].blings += Math.floor(Math.random() * 3 + ((this.card as CompanionCard).maxHealth || 4));
    }
    if((this.card as CompanionCard).boss && !game.battlefield.find(x => (x as CompanionCard).boss) && this.card.id != `slugfrost.bamboozle`) {
      log("VICTORY - Boss died");
      game.players[0].blings += Math.floor(Math.random() * 3 + 27);
      for(let i of game.cardsByPos(1)) game.players[0].blings += Math.floor(Math.random() * 3 + ((i as CompanionCard).maxHealth || 4));
      game.endCombat();
    }
  }
}

export class DrawAction extends Action {
  id = `base.draw`;
  player: Player;
  amount: number;
  constructor(player: Player, amount: number) {
    super();
    this.player = player;
    this.amount = amount;
  }
  run() {
    for(let i = 0; i < this.amount; i++) this.player.draw();
  }
}

export class ModifyFrenzyAction extends Action {
  id = `base.modifyFrenzy`;
  target: UnitCard;
  amount: number;
  constructor(target: UnitCard, amount: number) {
    super();
    this.target = target;
    this.amount = amount;
  }
  run() {
    this.target.frenzy = Math.max(1, this.target.frenzy + this.amount);
    this.target.updateElement();
    this.target.flash("orange");
  }
}