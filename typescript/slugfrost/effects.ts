import { Action, DealDamageAction, HitAction } from "../action.js";
import { Effect } from "../ability.js";
import { Side } from "../game.js";

export class BomEffect extends Effect {
  id = `slugfrost.bom`;
  name = "Bom";
  text = "Increases incoming damage from all sources";
  color = "yellow";
  side = Side.left;
  use(ac: Action) {
    if(((ac instanceof HitAction && ac.isAttack) || ac instanceof DealDamageAction) && ac.target == this.owner) {
      ac.amount += this.amount;
    }
  }
}