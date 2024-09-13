import { game, getId, hasAttack, hasCondition, hasCounter, log, ui } from "./game.js";
import { HitAction, FindTargetsAction, SummonUnitAction, TriggerAction, FinishedPlayingAction, DieAction, TempModifyCounterAction, GetDisplayedAttackAction } from "./action.js";
export class Card {
    constructor(owner, addToDeck = true, addToHand = false) {
        this.text = "";
        this.abilities = [];
        this.baseEffects = [];
        this.curEffects = [];
        this.charms = [];
        this.crowned = false;
        this.isLeader = false;
        this.frenzy = 1;
        this.owner = owner;
        if (addToDeck) {
            owner.deckpack.push(this);
            if (!addToHand)
                owner.drawPile.push(this);
        }
        if (addToHand) {
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
            if (ui.currentlyPlaying instanceof ItemCard && ((this instanceof UnitCard && this.fieldPos) || ui.currentlyPlaying.canHitHand) && (!hasCondition(ui.currentlyPlaying) || ui.currentlyPlaying.condition(this)) && game.inCombat) {
                if (game.resolving)
                    return;
                ui.currentlyPlaying.play(this);
                ui.deselect();
                game.endTurn();
                return;
            }
            if (ui.currentlyPlaying == this) {
                ui.deselect();
            }
            else if (this.owner.side == 0) {
                ui.deselect();
                ui.currentlyPlaying = this;
                this.element.classList.add("currentlyPlaying");
            }
        };
        getId("hand").appendChild(this.element);
    }
    createRewardElement(reward, price, flavorText) {
        this.element = document.createElement("div");
        this.element.classList.add("card");
        this.element.onmousedown = (e) => {
            if (game.players[0].blings < price) {
                log("You can't afford that!");
                return;
            }
            game.players[0].blings -= price;
            this.owner.deckpack.push(this);
            this.owner.drawPile.push(this);
            this.element.innerHTML = "";
            this.element.remove();
            this.element = undefined;
            this.updateElement();
            if (flavorText)
                getId(reward).innerHTML = flavorText(this.name);
        };
        getId(reward).appendChild(this.element);
    }
    updateElement() {
        if (!this.element)
            this.createElement();
        if (this.isLeader)
            this.element.classList.add("leader");
        if (this instanceof CompanionCard && this.boss)
            this.element.classList.add("boss");
        this.element.innerHTML = this.name + "<br/>" + (this.abilities.map(x => x.text).join("<br/>") || this.text);
        if (hasAttack(this)) {
            let el = Array.from(this.element.children).find(x => x.classList.contains("base-attack"));
            if (!el) {
                el = document.createElement("div");
                el.classList.add("base-attack", "cardright");
                this.element.appendChild(el);
            }
            el.innerHTML = "<span style='color:skyblue'>" + new GetDisplayedAttackAction(this, this.curAttack).execute() + "</span>";
        }
        for (let effect of this.curEffects) {
            let el = Array.from(this.element.children).find(x => x.classList.contains(effect.id.replace(".", "-")));
            if (!el) {
                el = document.createElement("div");
                el.classList.add(effect.id.replace(".", "-"), "card" + effect.side);
                this.element.appendChild(el);
            }
            el.style.top = Array.from(this.element.children).filter(x => x.classList.contains("card" + effect.side)).length * 20 + "px";
            el.innerHTML = "<span style='color:" + effect.color + "'>" + effect.amount + "</span>";
        }
        if (this.frenzy > 1) {
            let el = Array.from(this.element.children).find(x => x.classList.contains("base-frenzy"));
            if (!el) {
                el = document.createElement("div");
                el.classList.add("base-frenzy", "cardbottom");
                this.element.appendChild(el);
            }
            el.style.bottom = Array.from(this.element.children).filter(x => x.classList.contains("cardbottom")).length * 20 + "px";
            el.innerHTML = "<span style='color:orange'>{×" + this.frenzy + "}</span>";
        }
        if (this.abilities.find(x => x.isReaction)) {
            let el = Array.from(this.element.children).find(x => x.classList.contains("base-reaction"));
            if (!el) {
                el = document.createElement("div");
                el.classList.add("base-reaction", "cardbottom");
                this.element.appendChild(el);
            }
            el.style.bottom = Array.from(this.element.children).filter(x => x.classList.contains("cardbottom")).length * 20 + "px";
            el.innerHTML = `<span style='color:${this.curEffects.find(x => x.id == `base.snow`) ? "#77f" : "orange"}'>{!}</span>`;
        }
    }
    init() {
        if (hasAttack(this))
            this.curAttack = this.baseAttack;
        this.updateElement();
    }
    dance() { }
    flash(color) {
        this.element.style.background = color;
        setTimeout(() => { this.element.style.background = ""; }, 300);
    }
}
export class ItemCard extends Card {
    get canHitHand() { return !hasAttack(this) && !this.abilities.find(x => x.id.includes(".targeting.")); }
    play(target) {
        if ((target instanceof UnitCard && !target.fieldPos && !this.canHitHand) || (hasCondition(this) && !this.condition(target))) {
            log("cannot play " + this.name + " on card " + target.name);
            return false;
        }
        new FinishedPlayingAction(this).stack();
        for (let i = 0; i < this.frenzy; i++) {
            new FindTargetsAction(this, target).onEach(x => new HitAction(this, x).stack());
            new TriggerAction(this, i == 0).stack();
        }
        return true;
    }
}
export class UnitCard extends Card {
    init() {
        if (hasCounter(this)) {
            this.curCounter = this.baseCounter;
            this.maxCounter = this.baseCounter;
        }
        super.init();
    }
    summon(row, col) {
        let on = game.cardsByPos(this.owner.side, row, col)[0];
        if (!on) {
            while (!game.cardsByPos(this.owner.side, row, col - 1).length && col > 0)
                col--;
        }
        else if (col < 2 && !game.cardsByPos(this.owner.side, row, col + 1).length) {
            on.fieldPos.column++;
            on.element.style.left = getId(`slot-${this.owner.side}-${col + 1}-${row}`).offsetLeft + getId(`slot-${this.owner.side}-${col + 1}-${row}`).offsetWidth * 0.25 + "px";
        }
        else
            return false;
        new SummonUnitAction(this, this.owner.side, row, col).stack();
        return true;
    }
    die(source) {
        new DieAction(this, source).stack();
    }
    recall() {
        game.battlefield.splice(game.battlefield.indexOf(this), 1);
        for (let col = this.fieldPos.column + 1; col <= 2; col++) {
            let on = game.cardsByPos(this.fieldPos.side, this.fieldPos.row, col)[0];
            if (!on)
                break;
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
    tickDown(amount = -1) { if (hasCounter(this))
        new TempModifyCounterAction(this, amount).stack(); }
    trigger(forceTarget) {
        var _a;
        for (let i = 0; i < this.frenzy; i++) {
            if (hasAttack(this)) {
                let firstTarget = forceTarget || ((_a = game.cardsByPos(this.fieldPos.side == 0 ? 1 : 0, this.fieldPos.row)[0]) !== null && _a !== void 0 ? _a : game.cardsByPos(this.fieldPos.side == 0 ? 1 : 0)[0]);
                if (firstTarget)
                    new FindTargetsAction(this, firstTarget).onEach(x => new HitAction(this, x).stack());
                else
                    log(this.name + " has no targets!");
            }
            new TriggerAction(this, i == 0).stack();
        }
    }
    updateElement() {
        super.updateElement();
        if (hasCounter(this)) {
            let el = Array.from(this.element.children).find(x => x.classList.contains("base-counter"));
            if (!el) {
                el = document.createElement("div");
                el.classList.add("base-counter", "cardbottom");
                this.element.appendChild(el);
            }
            el.innerHTML = "<span style='color:" + (this.curEffects.find(x => x.id == `base.snow`) ? "gray" : this.curCounter == 1 ? "red" : "gold") + "'>" + this.curCounter + "</span>";
        }
    }
}
export class CompanionCard extends UnitCard {
    constructor() {
        super(...arguments);
        this.injured = false;
        this.boss = false;
    }
    takeDamage(amount, source) {
        this.curHealth -= amount;
        this.updateElement();
        if (this.curHealth <= 0)
            this.die(source);
        else
            this.danceHurt();
    }
    updateElement() {
        super.updateElement();
        let el = Array.from(this.element.children).find(x => x.classList.contains("base-health"));
        if (!el) {
            el = document.createElement("div");
            el.classList.add("base-health", "cardleft");
            this.element.appendChild(el);
        }
        el.innerHTML = "<span style='color:salmon'>" + this.curHealth + "</span>";
    }
    init() {
        this.maxHealth = this.baseHealth;
        if (this.injured)
            this.curHealth = Math.floor(0.5 * this.baseHealth);
        else
            this.curHealth = this.baseHealth;
        super.init();
    }
}
export class ClunkerCard extends UnitCard {
    takeDamage(amount, source) {
        if (amount > 0) {
            this.curScrap--;
            this.updateElement();
        }
        if (this.curScrap <= 0)
            this.die(source);
        else
            this.danceHurt();
    }
    updateElement() {
        super.updateElement();
        let el = Array.from(this.element.children).find(x => x.classList.contains("base-scrap"));
        if (!el) {
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
