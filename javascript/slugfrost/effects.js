import { DealDamageAction, HitAction } from "../action.js";
import { Effect } from "../ability.js";
import { Side } from "../game.js";
export class BomEffect extends Effect {
    constructor() {
        super(...arguments);
        this.id = `slugfrost.bom`;
        this.name = "Bom";
        this.text = "Increases incoming damage from all sources";
        this.color = "yellow";
        this.side = Side.left;
    }
    use(ac) {
        if (((ac instanceof HitAction && ac.isAttack) || ac instanceof DealDamageAction) && ac.target == this.owner) {
            ac.amount += this.amount;
        }
    }
}
