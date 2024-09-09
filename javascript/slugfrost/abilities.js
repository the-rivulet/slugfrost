import { Ability, hasMagicNumber } from "../ability.js";
import { ApplyEffectAction, HitAction, ModifyAttackAction, TriggerAction, TempModifyCounterAction, DieAction, DrawAction } from "../action.js";
import { UnitCard } from "../card.js";
import { hasAttack, hasCounter } from "../game.js";
export class ApplyEffectAbility extends Ability {
    get text() { return `Apply ${this.magic} ${this.name}`; }
    constructor(owner, makeEffect, amount, name) {
        super(owner);
        this.id = `slugfrost.applyEffect`;
        this.isReaction = false;
        this.makeEffect = makeEffect;
        this.baseMagic = amount;
        this.magic = amount;
        this.name = name;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.source == this.owner && ac.target instanceof UnitCard) {
            new ApplyEffectAction(this, ac.target, t => this.makeEffect(t, this.magic)).stack();
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
export class ModifyAttackAbility extends Ability {
    get text() { return `Increase Attack by ${this.magic}`; }
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
    get text() { return `Increase Attack by ${this.magic} when hit`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.gainAttackWhenHit`;
        this.isReaction = false;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
            new ModifyAttackAction(this.owner, this.magic).stack();
        }
    }
}
export class ModifyAttackWhenHitAbility extends Ability {
    get text() { return `When hit, apply ${this.magic} Attack to the attacker`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.modifyAttackWhenHit`;
        this.isReaction = false;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
            new ModifyAttackAction(this.owner, this.magic).stack();
        }
    }
}
export class GainAttackWhenAllyDiesAbility extends Ability {
    get text() { return `Increase Attack by ${this.magic} when an ally dies`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.gainAttackWhenAllyDies`;
        this.isReaction = false;
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
        this.text = "Escape from the battle";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof TriggerAction && ac.card == this.owner && this.owner instanceof UnitCard) {
            this.owner.die();
        }
    }
}
export class SmackbackAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.smackback`;
        this.text = "Smackback";
        this.isReaction = true;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack && ac.source instanceof UnitCard && this.owner instanceof UnitCard) {
            this.owner.trigger(ac.source);
        }
    }
}
export class DrawWhenHitAbility extends Ability {
    get text() { return `Draw ${this.magic} when hit`; }
    constructor(owner, amount) {
        super(owner);
        this.id = `slugfrost.drawWhenHit`;
        this.isReaction = false;
        this.magic = amount;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
            new DrawAction(this.owner.owner, this.magic).stack();
        }
    }
}
