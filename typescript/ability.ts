import { FindTargetsAction, Action, TempModifyCounterAction, ApplyEffectAction } from "./action.js";
import type { Card, UnitCard } from "./card.js";
import { game, Side } from "./game.js";

export abstract class Ability {
  abstract id: string;
  owner: Card;
  abstract text: string;
  abstract isReaction: boolean;
  abstract use(ac: Action): void;
  constructor(owner: Card) {
    this.owner = owner;
  }
}

export abstract class Effect {
  abstract id: string;
  abstract name: string;
  abstract text: string;
  abstract color: string;
  abstract side: Side;
  owner: UnitCard;
  lastAppliedBy?: Ability;
  amount: number;
  get asAbility() { return new UniqueAbility(`base.effectAbility.` + this.id, this.lastAppliedBy.owner, this.text, false, this.use); }
  abstract use(ac: Action): void;
  constructor(owner: UnitCard, amount: number) {
    this.owner = owner;
    this.amount = amount;
  }
}

// putting this here because it needs a special case
export class SnowEffect extends Effect {
  id = `base.snow`;
  name = "Snow";
  text = "Halts counter and reactions";
  color = "#77f";
  side = Side.right;
  use(ac: Action) {
    if(ac instanceof TempModifyCounterAction && ac.amount < 0 && ac.target == this.owner) {
      let change = Math.min(this.amount, -1 * ac.amount);
      ac.amount += change;
      new ApplyEffectAction(this.asAbility, this.owner, t => new SnowEffect(t, -1 * change)).stack();
    }
  }
}

export interface HasMagicNumber extends Ability {
  baseMagic: number;
  magic: number;
}
export function hasMagicNumber(ability: Ability): ability is HasMagicNumber {
  return "baseMagic" in ability && typeof ability.baseMagic == "number";
}

export class UniqueAbility extends Ability {
  id = `base.uniqueAbility`;
  text: string;
  isReaction: boolean;
  use: (ac: Action) => void;
  constructor(id: string, owner: Card, text: string, isReaction: boolean, use: (ac: Action) => void) {
    super(owner);
    this.id = id;
    this.text = text;
    this.isReaction = isReaction;
    this.use = use;
  }
}

export class HitsAllEnemiesAbility extends Ability {
  id = `base.targeting.hitsAllEnemies`;
  text = "Hits all enemies";
  isReaction = false;
  use(ac: Action) {
    if(ac instanceof FindTargetsAction && ac.source == this.owner) {
      ac.targets = game.cardsByPos((ac.targets[0] as UnitCard).fieldPos.side);
    }
  }
}

export class BarrageAbility extends Ability {
  id = `base.targeting.barrage`;
  text = "Barrage";
  isReaction = false;
  use(ac: Action) {
    if(ac instanceof FindTargetsAction && ac.source == this.owner) {
      ac.targets = game.cardsByPos((ac.targets[0] as UnitCard).fieldPos.side, (ac.targets[0] as UnitCard).fieldPos.row);
    }
  }
}

export class AimlessAbility extends Ability {
  id = `base.targeting.aimless`;
  text = "Aimless";
  isReaction = false;
  use(ac: Action) {
    if(ac instanceof FindTargetsAction && ac.source == this.owner) {
      ac.targets = game.cardsByPos((ac.targets[0] as UnitCard).fieldPos.side, (ac.targets[0] as UnitCard).fieldPos.row);
      ac.random = 1;
    }
  }
}