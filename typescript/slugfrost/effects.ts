import { Action, ApplyEffectAction, DealDamageAction, GetDisplayedAttackAction, HitAction, ModifyAttackAction, TriggerAction } from "../action.js";
import { Effect } from "../ability.js";
import { hasAttack, Side } from "../game.js";
import { UnitCard } from "../card.js";

export class BomEffect extends Effect {
  id = `slugfrost.bom`;
  name = "Bom";
  text = "Increases incoming damage from all sources";
  color = "yellow";
  side = Side.left;
  isBuff = false;
  use(ac: Action) {
    if(((ac instanceof HitAction && ac.isAttack) || ac instanceof DealDamageAction) && ac.target == this.owner) {
      ac.amount += this.amount;
    }
  }
}

export class FrostEffect extends Effect {
  id = `slugfrost.frost`;
  name = "Frost";
  text = "Decreases damage for one hit";
  color = "purple";
  side = Side.right;
  isBuff = false;
  use(ac: Action) {
    if(ac instanceof HitAction && ac.isAttack && ac.source == this.owner) {
      ac.amount -= this.amount;
    } else if(ac instanceof TriggerAction && hasAttack(ac.card) && ac.card instanceof UnitCard && ac.card == this.owner && ac.isFirst) {
      new ApplyEffectAction(this.asAbility, ac.card, t => new FrostEffect(t, -1 * this.amount)).queue();
    } else if(ac instanceof GetDisplayedAttackAction && hasAttack(this.owner) && ac.card == this.owner) {
      ac.amount -= this.amount;
    }
  }
}

export class SpiceEffect extends Effect {
  id = `slugfrost.spice`;
  name = "Spice";
  text = "Increases damage for one hit";
  color = "red";
  side = Side.right;
  isBuff = true;
  use(ac: Action) {
    if(ac instanceof HitAction && ac.isAttack && ac.source == this.owner) {
      ac.amount += this.amount;
    } else if(ac instanceof TriggerAction && hasAttack(ac.card) && ac.card instanceof UnitCard && ac.card == this.owner && ac.isFirst) {
      new ApplyEffectAction(this.asAbility, ac.card, t => new SpiceEffect(t, -1 * this.amount)).queue();
    } else if(ac instanceof GetDisplayedAttackAction && hasAttack(this.owner) && ac.card == this.owner) {
      ac.amount += this.amount;
    }
  }
}