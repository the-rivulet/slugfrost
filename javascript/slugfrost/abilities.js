import { Ability, CustomEffect } from "../ability.js";
import { ApplyEffectAction, HitAction, FindTargetsAction, ModifyAttackAction, TriggerAction, TempModifyCounterAction, DieAction, DrawAction, SummonUnitAction, ModifyMaxCounterAction, ModifyFrenzyAction, GetDisplayedAttackAction, RestoreAction, TakeDamageAction, ModifyMaxHealthAction, DealDamageAction } from "../action.js";
import { CompanionCard, UnitCard } from "../card.js";
import { game, getId, hasAttack, hasCounter, hasMagicNumber } from "../game.js";
export class ApplyEffectAbility extends Ability {
    get text() { return `Apply ${this.magic} ${this.makeEffect(undefined, 0).name}`; }
    constructor(owner, makeEffect, amount) {
        super(owner);
        this.id = `slugfrost.applyEffect`;
        this.isReaction = false;
        this.makeEffect = makeEffect;
        this.tooltipText = this.makeEffect(undefined, 0).text;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && ac.target instanceof UnitCard) {
            new ApplyEffectAction(this, ac.target, t => this.makeEffect(t, this.magic)).stack();
        }
    }
}
export class ApplyEffectEqualToDamageAbility extends Ability {
    get text() { return `Apply ${this.makeEffect(undefined, 0).name} equal to damage dealt`; }
    constructor(owner, makeEffect) {
        super(owner);
        this.id = `slugfrost.applyEffectEqualToDamage`;
        this.isReaction = false;
        this.makeEffect = makeEffect;
        this.tooltipText = this.makeEffect(undefined, 0).text;
    }
    use(ac) {
        if (ac instanceof TakeDamageAction && ac.source == this.owner) {
            new ApplyEffectAction(this, ac.target, t => this.makeEffect(t, ac.amount)).stack();
        }
    }
}
export class ApplyEffectToAllyBehindAbility extends Ability {
    get text() { return `Apply ${this.magic} ${this.makeEffect(undefined, 0).name} to ally behind`; }
    constructor(owner, makeEffect, amount) {
        super(owner);
        this.id = `slugfrost.applyEffectToAllyBehind`;
        this.isReaction = false;
        this.makeEffect = makeEffect;
        this.tooltipText = this.makeEffect(undefined, 0).text;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && game.cardsByPos(this.owner.owner.side, this.owner.fieldPos.row, this.owner.fieldPos.column + 1)) {
            new ApplyEffectAction(this, game.cardsByPos(this.owner.owner.side, this.owner.fieldPos.row, this.owner.fieldPos.column + 1)[0], t => this.makeEffect(t, this.magic)).stack();
        }
    }
}
export class ApplyEffectToAlliesAbility extends Ability {
    get text() { return `Apply ${this.magic} ${this.makeEffect(undefined, 0).name} to all allies`; }
    constructor(owner, makeEffect, amount) {
        super(owner);
        this.id = `slugfrost.applyEffectToAllies`;
        this.isReaction = false;
        this.makeEffect = makeEffect;
        this.tooltipText = this.makeEffect(undefined, 0).text;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner) {
            for (let i of game.cardsByPos(this.owner.owner.side).filter(x => x instanceof CompanionCard && x != this.owner)) {
                new ApplyEffectAction(this, i, t => this.makeEffect(t, this.magic)).stack();
            }
        }
    }
}
export class ApplyEffectToRandomEnemyWhenHitAbility extends Ability {
    get text() { return `When hit, apply ${this.magic} ${this.makeEffect(undefined, 0).name} to a random enemy`; }
    constructor(owner, makeEffect, amount) {
        super(owner);
        this.id = `slugfrost.applyEffectToRandomEnemyWhenHit`;
        this.isReaction = false;
        this.makeEffect = makeEffect;
        this.tooltipText = this.makeEffect(undefined, 0).text;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
            let board = game.cardsByPos(this.owner.fieldPos.side == 0 ? 1 : 0);
            new ApplyEffectAction(this, board[Math.floor(Math.random() * board.length)], t => this.makeEffect(t, this.magic)).stack();
        }
    }
}
export class GainEqualEffectWhenHealthLostAbility extends Ability {
    get text() { return `When health lost, apply equal, gain equal ${this.makeEffect(undefined, 0).name}`; }
    constructor(owner, makeEffect) {
        super(owner);
        this.id = `slugfrost.gainEqualEffectWhenHealthLost`;
        this.isReaction = false;
        this.makeEffect = makeEffect;
        this.tooltipText = this.makeEffect(undefined, 0).text;
    }
    use(ac) {
        if (ac instanceof TakeDamageAction && ac.target == this.owner && ac.amount > 0) {
            new ApplyEffectAction(this, this.owner, t => this.makeEffect(t, ac.amount)).stack();
        }
    }
}
export class IncreaseWhenHitAbility extends Ability {
    get text() { return `Increase by ${this.amount} when hit`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.increaseWhenHit`;
        this.isReaction = false;
        this.amount = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
            for (let i of this.owner.abilities.filter(x => hasMagicNumber(x))) {
                i.magic += this.amount;
            }
        }
    }
}
export class TempModifyCounterAbility extends Ability {
    get text() { return `Count up Counter by ${this.magic}`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.tempModifyCounter`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && ac.target instanceof UnitCard && hasCounter(ac.target)) {
            new TempModifyCounterAction(ac.target, this.magic).stack();
        }
    }
}
export class ModifyMaxCounterAbility extends Ability {
    get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Max Counter`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.modifyMaxCounter`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && ac.target instanceof UnitCard && hasCounter(ac.target)) {
            new ModifyMaxCounterAction(ac.target, this.magic).stack();
        }
    }
}
export class ModifyAttackAbility extends Ability {
    get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Attack`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.modifyAttack`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && hasAttack(ac.target)) {
            new ModifyAttackAction(ac.target, this.magic).stack();
        }
    }
}
export class GainAttackWhenHitAbility extends Ability {
    get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Attack when hit`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.gainAttackWhenHit`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
            new ModifyAttackAction(this.owner, this.magic).stack();
        }
    }
}
export class ModifyAttackWhenHitAbility extends Ability {
    get text() { return `When hit, ${this.magic >= 0 ? "+" : ""}${this.magic} Attack to the attacker`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.modifyAttackWhenHit`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack && hasAttack(ac.source)) {
            new ModifyAttackAction(ac.source, this.magic).stack();
        }
    }
}
export class GainAttackWhenAllyDiesAbility extends Ability {
    get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Attack when an ally dies`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.gainAttackWhenAllyDies`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof DieAction && ac.card.fieldPos.side == this.owner.owner.side && !(this.owner instanceof UnitCard && ac.card == this.owner)) {
            new ModifyAttackAction(this.owner, this.magic).stack();
        }
    }
}
export class EscapeFromBattleAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.escapeFromBattle`;
        this.text = "Escape!";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof TriggerAction && ac.card == this.owner && this.owner instanceof UnitCard) {
            this.owner.die(this);
        }
    }
}
export class SmackbackAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.smackback`;
        this.text = "Smackback";
        this.tooltipText = "When attacked, hits back";
        this.isReaction = true;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack && ac.source instanceof UnitCard && this.owner instanceof UnitCard) {
            this.owner.trigger(ac.source);
        }
    }
}
export class TriggerWhenAllyInRowAttacksAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.triggerWhenAllyInRowAttacks`;
        this.text = "Trigger when an ally in the row attacks";
        this.isReaction = true;
    }
    use(ac) {
        if (ac instanceof TriggerAction && !ac.card.abilities.find(x => x instanceof TriggerWhenAllyInRowAttacksAbility) && ac.card instanceof UnitCard && ac.card.owner.side == this.owner.owner.side && ac.card.fieldPos.row == this.owner.fieldPos.row) {
            this.owner.trigger();
        }
    }
}
export class DrawWhenHitAbility extends Ability {
    get text() { return `Draw ${this.magic} when hit`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.drawWhenHit`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
            new DrawAction(this.owner.owner, this.magic).stack();
        }
    }
}
export class WhileActiveAddAttackToAlliesAbility extends Ability {
    get text() { return `While active, add ${this.amount} Attack to all allies`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.whileActiveAddAttackToAllies`;
        this.isReaction = false;
        this.amount = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.isAttack && ac.source.owner.side == this.owner.owner.side) {
            ac.amount += this.amount;
        }
        else if (ac instanceof GetDisplayedAttackAction && ac.card.owner.side == this.owner.owner.side && !(hasAttack(this.owner) && ac.card == this.owner)) {
            ac.amount += this.amount;
        }
    }
}
export class ModifyFrenzyAbility extends Ability {
    get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Frenzy`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.modifyFrenzy`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && ac.target instanceof UnitCard) {
            new ModifyFrenzyAction(ac.target, this.magic).stack();
        }
    }
}
export class DropBlingWhenHitAbility extends Ability {
    get text() { return `Drop ${this.magic} Bling when hit`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.dropBlingWhenHit`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.target instanceof UnitCard) {
            game.players[0].blings += this.magic;
        }
    }
}
export class RestoreAbility extends Ability {
    get text() { return `Restore ${this.magic} Health`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.restore`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && ac.target instanceof CompanionCard) {
            new RestoreAction(ac.target, this.magic, this).stack();
        }
    }
}
export class ModifyMaxHealthAbility extends Ability {
    get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Max HP`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.modifyMaxHealth`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && ac.target instanceof CompanionCard) {
            new ModifyMaxHealthAction(ac.target, this.magic, this).stack();
        }
    }
}
export class RestoreAlliesAbility extends Ability {
    get text() { return `Restore ${this.magic} Health to all allies`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.restoreAllies`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner) {
            for (let i of game.cardsByPos(this.owner.owner.side).filter(x => x instanceof CompanionCard && x != this.owner)) {
                new RestoreAction(i, this.magic, this).stack();
            }
        }
    }
}
export class RestoreAlliesInRowOnKillAbility extends Ability {
    get text() { return `On kill, restore ${this.magic} Health to self & allies in row`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.restoreAlliesInRowOnKill`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof DieAction && (ac.source == this.owner || (ac.source instanceof Ability && ac.source.owner == this.owner))) {
            for (let i of game.cardsByPos(this.owner.owner.side, this.owner.fieldPos.row).filter(x => x instanceof CompanionCard)) {
                new RestoreAction(i, this.magic, this).stack();
            }
        }
    }
}
export class AlliesRestoreWhenHitAbility extends Ability {
    get text() { return `When an ally is hit, they restore ${this.magic} Health`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.alliesRestoreWhenHit`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target.owner.side == this.owner.owner.side && ac.target instanceof CompanionCard && this.owner.fieldPos) {
            new RestoreAction(ac.target, this.magic, this).stack();
        }
    }
}
export class LifelinkFrontAllyAbility extends Ability {
    get text() { return `Restore Health to front ally equal to damage`; }
    constructor(owner) {
        super(owner);
        this.id = `slugfrost.lifelinkFrontAlly`;
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof TakeDamageAction && ac.source == this.owner) {
            let front = game.cardsByPos(this.owner.owner.side, ac.target.fieldPos.row)[0];
            if (front && front instanceof CompanionCard)
                new RestoreAction(front, ac.amount, this).stack();
        }
    }
}
export class CleanseAlliesAbility extends Ability {
    get text() { return `Remove debuffs from allies`; }
    constructor(owner) {
        super(owner);
        this.id = `slugfrost.cleanseAllies`;
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner) {
            for (let i of game.cardsByPos(this.owner.owner.side).filter(x => x instanceof CompanionCard && x != this.owner)) {
                for (let j of i.curEffects.filter(x => !x.isBuff)) {
                    new ApplyEffectAction(this, i, t => new CustomEffect(t, -1 * j.amount, j.id)).stack();
                }
            }
        }
    }
}
export class DealDamageBackWhenHitAbility extends Ability {
    get text() { return `When hit, deal equal damage back`; }
    constructor(owner) {
        super(owner);
        this.id = `slugfrost.dealDamageBackWhenHit`;
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof TakeDamageAction && ac.target == this.owner && ac.amount > 0 && ac.source instanceof UnitCard) {
            new DealDamageAction(this, ac.source, ac.amount).queue();
        }
    }
}
export class BarrageToAlliesAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.targeting.barrageToAllies`;
        this.text = "Allies gain Barrage";
        this.tooltipText = "They hit all targets in the row";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof FindTargetsAction && ac.source instanceof UnitCard && ac.source.owner.side == this.owner.owner.side && this.owner.fieldPos) {
            ac.targets = game.cardsByPos(ac.targets[0].fieldPos.side, ac.targets[0].fieldPos.row);
        }
    }
}
export class IncreaseDamageByHealthAbility extends Ability {
    constructor(owner) {
        super(owner);
        this.id = `slugfrost.increaseDamageByHealth`;
        this.text = "Add Health to Attack";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.isAttack && ac.source == this.owner) {
            ac.amount += this.owner.curHealth;
        }
        else if (ac instanceof GetDisplayedAttackAction && hasAttack(this.owner) && ac.card == this.owner) {
            ac.amount += this.owner.curHealth;
        }
    }
}
export class ResistEffectAbility extends Ability {
    get text() { return `Max ${this.amount} ${(this.effectId.split(".")[1])[0].toUpperCase() + (this.effectId.split(".")[1]).slice(1)}`; }
    constructor(owner, amount, effectId) {
        super(owner);
        this.id = `slugfrost.resistEffect`;
        this.isReaction = false;
        this.amount = amount;
        this.effectId = effectId;
    }
    use(ac) {
        if (ac instanceof ApplyEffectAction && ac.target == this.owner) {
            ac._makeEffect = (t) => {
                var _a;
                let effect = ac.makeEffect(t);
                if (effect.id == this.effectId)
                    effect.amount = Math.min(effect.amount, this.amount - (((_a = t.curEffects.find(x => x.id == effect.id)) === null || _a === void 0 ? void 0 : _a.amount) || 0));
                return effect;
            };
        }
    }
}
export class IncreaseDamageWhileHurtAbility extends Ability {
    get text() { return `Increase Attack by ${this.magic} while hurt`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.increaseDamageWhileHurt`;
        this.isReaction = false;
        this.baseMagic = amount;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.isAttack && ac.source == this.owner) {
            ac.amount += this.magic;
        }
        else if (ac instanceof GetDisplayedAttackAction && ac.card == this.owner) {
            ac.amount += this.magic;
        }
    }
}
export class SummonUnitWhenKilledAbility extends Ability {
    constructor(owner, makeUnit) {
        super(owner);
        this.id = `slugfrost.summonUnitWhenKilled`;
        this.text = "";
        this.isReaction = false;
        this.makeUnit = makeUnit;
    }
    use(ac) {
        if (ac instanceof DieAction && ac.card == this.owner) {
            let u = this.makeUnit();
            u.init();
            new SummonUnitAction(u, this.owner.owner.side, this.owner.fieldPos.row, this.owner.fieldPos.column).stack();
            for (let col = this.owner.fieldPos.column + 1; col <= 2; col++) {
                let on = game.cardsByPos(this.owner.fieldPos.side, this.owner.fieldPos.row, col)[0];
                if (!on)
                    break;
                on.fieldPos.column++;
                let el = getId(`slot-${this.owner.owner.side}-${col - 1}-${this.owner.fieldPos.row}`);
                on.element.style.left = el.offsetLeft + el.offsetWidth * 0.25 + "px";
            }
        }
    }
}
export class WildAbility extends Ability {
    constructor(owner) {
        super(owner);
        this.id = `slugfrost.wild`;
        this.text = "Wild";
        this.tooltipText = "Gain 1 Frenzy when another Wild card is killed";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof DieAction && ac.card != this.owner && ac.card.abilities.find(x => x instanceof WildAbility)) {
            new ModifyFrenzyAction(this.owner, 1).stack();
        }
    }
}
