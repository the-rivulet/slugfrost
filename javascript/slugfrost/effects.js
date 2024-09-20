import { ApplyEffectAction, DealDamageAction, GetDisplayedAttackAction, HitAction, TriggerAction } from "../action.js";
import { Effect } from "../ability.js";
import { hasAttack, Side } from "../game.js";
import { UnitCard } from "../card.js";
export class BomEffect extends Effect {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.bom`;
        this.name = "Bom";
        this.text = "Increases incoming damage from all sources";
        this.color = "yellow";
        this.side = Side.left;
        this.isBuff = false;
    }
    use(ac) {
        if (((ac instanceof HitAction && ac.isAttack) || ac instanceof DealDamageAction) && ac.target == this.owner) {
            ac.amount += this.amount;
        }
    }
}
export class FrostEffect extends Effect {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.frost`;
        this.name = "Frost";
        this.text = "Decreases damage for one hit";
        this.color = "purple";
        this.side = Side.right;
        this.isBuff = false;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.isAttack && ac.source == this.owner) {
            ac.amount -= this.amount;
        }
        else if (ac instanceof TriggerAction && hasAttack(ac.card) && ac.card instanceof UnitCard && ac.card == this.owner && ac.isFirst) {
            new ApplyEffectAction(this.asAbility, ac.card, t => new FrostEffect(t, -1 * this.amount)).queue();
        }
        else if (ac instanceof GetDisplayedAttackAction && hasAttack(this.owner) && ac.card == this.owner) {
            ac.amount -= this.amount;
        }
    }
}
export class SpiceEffect extends Effect {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.spice`;
        this.name = "Spice";
        this.text = "Increases damage for one hit";
        this.color = "red";
        this.side = Side.right;
        this.isBuff = true;
    }
    use(ac) {
        if (ac instanceof HitAction && ac.isAttack && ac.source == this.owner) {
            ac.amount += this.amount;
        }
        else if (ac instanceof TriggerAction && hasAttack(ac.card) && ac.card instanceof UnitCard && ac.card == this.owner && ac.isFirst) {
            new ApplyEffectAction(this.asAbility, ac.card, t => new SpiceEffect(t, -1 * this.amount)).queue();
        }
        else if (ac instanceof GetDisplayedAttackAction && hasAttack(this.owner) && ac.card == this.owner) {
            ac.amount += this.amount;
        }
    }
}
