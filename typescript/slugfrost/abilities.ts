import { Ability, Effect, hasMagicNumber, HasMagicNumber } from "../ability.js";
import { Action, ApplyEffectAction, HitAction, FindTargetsAction, ModifyAttackAction, TriggerAction, TempModifyCounterAction, DieAction, DrawAction } from "../action.js";
import { Card, UnitCard } from "../card.js";
import { HasAttack, hasAttack, hasCounter, log } from "../game.js";

export class ApplyEffectAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.applyEffect`;
  get text() { return `Apply ${this.magic} ${this.name}`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  name: string;
  makeEffect: (target: UnitCard, amount: number) => Effect;
  constructor(owner: Card, makeEffect: (target: UnitCard, amount: number) => Effect, amount: number, name: string) {
    super(owner);
    this.makeEffect = makeEffect;
    this.baseMagic = amount;
    this.magic = amount;
    this.name = name;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner && ac.target instanceof UnitCard) {
      new ApplyEffectAction(this, ac.target, t => this.makeEffect(t, this.magic)).stack();
    }
  }
}

export class IncreaseWhenHitAbility extends Ability {
  id = `slugfrost.increaseWhenHit`;
  get text() { return `Increase by ${this.amount} when hit`; }
  isReaction = false;
  amount: number;
  constructor(owner: UnitCard, amount: number) {
    super(owner);
    this.amount = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
      for(let i of this.owner.abilities.filter(x => hasMagicNumber(x))) {
        i.magic += this.amount;
      }
    }
  }
}

export class TempModifyCounterAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.tempModifyCounter`;
  get text() { return `Count up Counter by ${this.magic}`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner && ac.target instanceof UnitCard && hasCounter(ac.target)) {
      new TempModifyCounterAction(ac.target, this.magic).stack();
    }
  }
}

export class ModifyAttackAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.modifyAttack`;
  get text() { return `Increase Attack by ${this.magic}`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner && hasAttack(ac.target)) {
      new ModifyAttackAction(ac.target, this.magic).stack();
    }
  }
}

export class GainAttackWhenHitAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.gainAttackWhenHit`;
  get text() { return `Increase Attack by ${this.magic} when hit`; }
  isReaction = false;
  owner: HasAttack;
  baseMagic: number;
  magic: number;
  constructor(owner: HasAttack, amount: number) {
    super(owner);
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
      new ModifyAttackAction(this.owner, this.magic).stack();
    }
  }
}

export class ModifyAttackWhenHitAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.modifyAttackWhenHit`;
  get text() { return `When hit, apply ${this.magic} Attack to the attacker`; }
  isReaction = false;
  owner: HasAttack;
  baseMagic: number;
  magic: number;
  constructor(owner: HasAttack, amount: number) {
    super(owner);
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
      new ModifyAttackAction(this.owner, this.magic).stack();
    }
  }
}

export class GainAttackWhenAllyDiesAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.gainAttackWhenAllyDies`;
  get text() { return `Increase Attack by ${this.magic} when an ally dies`; }
  isReaction = false;
  owner: HasAttack;
  baseMagic: number;
  magic: number;
  constructor(owner: HasAttack, amount: number) {
    super(owner);
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof DieAction && ac.card.fieldPos.side == this.owner.owner.side && !(this.owner instanceof UnitCard && ac.card == this.owner)) {
      new ModifyAttackAction(this.owner, this.magic).stack();
    }
  }
}

export class EscapeFromBattleAbility extends Ability {
  id = `slugfrost.escapeFromBattle`;
  text = "Escape from the battle";
  isReaction = false;
  use(ac: Action) {
    if(ac instanceof TriggerAction && ac.card == this.owner && this.owner instanceof UnitCard) {
      this.owner.die(); // haha
    }
  }
}

export class SmackbackAbility extends Ability {
  id = `slugfrost.smackback`;
  text = "Smackback";
  isReaction = true;
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.isAttack && ac.source instanceof UnitCard && this.owner instanceof UnitCard) {
      this.owner.trigger(ac.source);
    }
  }
}

export class DrawWhenHitAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.drawWhenHit`;
  get text() { return `Draw ${this.magic} when hit`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
      new DrawAction(this.owner.owner, this.magic).stack();
    }
  }
}