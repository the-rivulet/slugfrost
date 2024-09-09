import { game, log, hasAttack, getId } from "./game.js";
export class Action {
    execute() {
        try {
            for (let i of game.cardsByPos()) {
                for (let j of i.abilities) {
                    if (!i.curEffects.map(x => x.id).includes("base.snow") || !j.isReaction)
                        j.use(this);
                }
                for (let k of i.curEffects) {
                    k.use(this);
                }
            }
            for (let p of game.players) {
                for (let i of p.hand) {
                    for (let j of i.abilities) {
                        if (!i.curEffects.map(x => x.id).includes("base.snow") || !j.isReaction)
                            j.use(this);
                    }
                    for (let k of i.curEffects) {
                        k.use(this);
                    }
                }
            }
            log("=".repeat(game.actionStack.length) + "> Running: " + this.id);
            return this.run();
        }
        catch (e) {
            log("Error in " + this.id + "'s execution: " + e);
        }
    }
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
    constructor(card) {
        super();
        this.id = `base.trigger`;
        this.card = card;
    }
    run() {
        this.card.dance();
    }
}
export class FinishedPlayingAction extends Action {
    constructor(card) {
        super();
        this.id = `base.finishedPlaying`;
        this.card = card;
    }
    run() {
        if (this.card.owner.hand.includes(this.card)) {
            this.card.owner.discard(this.card);
        }
    }
}
export class FindTargetsAction extends Action {
    constructor(source, firstTarget, random = 0) {
        super();
        this.id = `base.findTargets`;
        this.random = 0;
        this.source = source;
        this.targets = [firstTarget];
        this.random = random;
    }
    run() {
        return this.targets;
    }
    onEach(func) {
        this.execute().forEach(func);
    }
}
export class TakeDamageAction extends Action {
    constructor(target, amount) {
        super();
        this.id = `base.takeDamage`;
        this.target = target;
        this.amount = amount;
    }
    run() {
        log("p" + this.target.owner.side + "'s " + this.target.name + " took " + this.amount + " damage");
        this.target.takeDamage(this.amount);
    }
}
export class HitAction extends Action {
    constructor(source, target) {
        super();
        this.id = `base.hit`;
        this.source = source;
        this.target = target;
        this.amount = hasAttack(source) ? Math.max(0, source.curAttack) : 0;
        this.isAttack = hasAttack(source);
    }
    run() {
        var _a;
        if (this.isAttack && !(this.target.fieldPos) && this.source.fieldPos) {
            this.target = ((_a = game.cardsByPos(this.source.fieldPos.side == 0 ? 1 : 0, this.source.fieldPos.row)[0]) !== null && _a !== void 0 ? _a : game.cardsByPos(this.source.fieldPos.side == 0 ? 1 : 0)[0]);
            if (!this.target) {
                log("But there was no target!");
                return;
            }
        }
        log("p" + this.source.owner.side + "'s " + this.source.name + " hit p" + this.target.owner.side + "'s " + this.target.name + (this.isAttack ? " for " + this.amount + " damage" : ""));
        if (this.isAttack && game.battlefield.includes(this.target))
            new TakeDamageAction(this.target, this.amount).stack();
    }
}
export class DealDamageAction extends Action {
    constructor(source, target, amount) {
        super();
        this.id = `base.dealDamage`;
        this.source = source;
        this.target = target;
        this.amount = amount;
    }
    run() {
        log(this.source.id + " on p" + this.source.owner.owner.side + "'s " + this.source.owner.name + " damaged p" + this.target.owner.side + "'s " + this.target.name + " for " + this.amount + " damage");
        if (game.battlefield.includes(this.target))
            new TakeDamageAction(this.target, this.amount).stack();
    }
}
export class SummonUnitAction extends Action {
    constructor(card, side, row, column) {
        super();
        this.id = `base.summonUnit`;
        this.card = card;
        this.side = side;
        this.row = row;
        this.column = column;
    }
    run() {
        log("p" + this.card.owner.side + " summoned " + this.card.name);
    }
}
export class ApplyEffectAction extends Action {
    constructor(source, target, makeEffect) {
        super();
        this.id = `base.applyEffect`;
        this.source = source;
        this.target = target;
        this.makeEffect = makeEffect;
    }
    run() {
        let effect = this.makeEffect(this.target);
        log(this.source.id + " on p" + this.source.owner.owner.side + "'s " + this.source.owner.name + " applied " + effect.amount + " " + effect.name + " to p" + this.target.owner.side + "'s " + this.target.name);
        let exists = this.target.curEffects.find(x => x.id == effect.id);
        if (exists) {
            exists.lastAppliedBy = this.source;
            exists.amount = Math.max(0, exists.amount + effect.amount);
            log(this.target.name + "'s " + effect.name + " is now " + exists.amount);
            if (exists.amount == 0)
                this.target.curEffects.splice(this.target.curEffects.indexOf(exists), 1);
        }
        else if (effect.amount > 0) {
            effect.lastAppliedBy = this.source;
            this.target.curEffects.push(effect);
        }
        this.target.updateElement();
        this.target.flash(effect.color);
    }
}
export class TempModifyCounterAction extends Action {
    constructor(target, amount) {
        super();
        this.id = `base.tempModifyCounter`;
        this.target = target;
        this.amount = amount;
    }
    run() {
        this.target.curCounter += this.amount;
        if (this.target.curCounter <= 0) {
            this.target.trigger();
            this.target.curCounter = this.target.baseCounter;
        }
        this.target.updateElement();
        this.target.flash("gold");
    }
}
export class ModifyAttackAction extends Action {
    constructor(target, amount) {
        super();
        this.id = `base.modifyAttack`;
        this.target = target;
        this.amount = amount;
    }
    run() {
        this.target.curAttack += this.amount;
        this.target.updateElement();
        this.target.flash("skyblue");
    }
}
export class DieAction extends Action {
    constructor(card) {
        super();
        this.id = `base.die`;
        this.card = card;
    }
    run() {
        game.battlefield.splice(game.battlefield.indexOf(this.card), 1);
        for (let col = this.card.fieldPos.column + 1; col <= 2; col++) {
            let on = game.cardsByPos(this.card.fieldPos.side, this.card.fieldPos.row, col)[0];
            if (!on)
                break;
            on.fieldPos.column--;
            let el = getId(`slot-${this.card.owner.side}-${col - 1}-${this.card.fieldPos.row}`);
            on.element.style.left = el.offsetLeft + el.offsetWidth * 0.25 + "px";
        }
        this.card.fieldPos = undefined;
        this.card.element.style.opacity = "0";
        setTimeout(() => { this.card.element.remove(); }, 300);
        log("p" + this.card.owner.side + "'s " + this.card.name + " died");
        if (this.card.isLeader) {
            alert("DEFEAT - Leader died");
            log("DEFEAT - Leader died");
        }
        if (this.card.id == `slugfrost.bigPeng`) {
            alert("VICTORY - Defeated Big Peng");
            log("VICTORY - Defeated Big Peng");
        }
    }
}
export class DrawAction extends Action {
    constructor(player, amount) {
        super();
        this.id = `base.draw`;
        this.player = player;
        this.amount = amount;
    }
    run() {
        for (let i = 0; i < this.amount; i++)
            this.player.draw();
    }
}
