import { Ability, CustomEffect, Effect } from "../ability.js";
import { Action, ApplyEffectAction, HitAction, FindTargetsAction, ModifyAttackAction, TriggerAction, TempModifyCounterAction, DieAction, DrawAction, SummonUnitAction, ModifyMaxCounterAction, ModifyFrenzyAction, GetDisplayedAttackAction, RestoreAction, TakeDamageAction, ModifyMaxHealthAction, DealDamageAction } from "../action.js";
import { Card, CompanionCard, UnitCard } from "../card.js";
import { game, getId, HasAttack, hasAttack, hasCounter, hasMagicNumber, HasMagicNumber } from "../game.js";

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

export class ApplyEffectEqualToDamageAbility extends Ability {
  id = `slugfrost.applyEffectEqualToDamage`;
  get text() { return `Apply ${this.name} equal to damage dealt`; }
  isReaction = false;
  name: string;
  makeEffect: (target: UnitCard, amount: number) => Effect;
  constructor(owner: Card, makeEffect: (target: UnitCard, amount: number) => Effect, name: string) {
    super(owner);
    this.makeEffect = makeEffect;
    this.name = name;
  }
  use(ac: Action) {
    if(ac instanceof TakeDamageAction && ac.source == this.owner) {
      new ApplyEffectAction(this, ac.target, t => this.makeEffect(t, ac.amount)).stack();
    }
  }
}

export class ApplyEffectToAllyBehindAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.applyEffectToAllyBehind`;
  get text() { return `Apply ${this.magic} ${this.name} to ally behind`; }
  isReaction = false;
  owner: UnitCard;
  baseMagic: number;
  magic: number;
  name: string;
  makeEffect: (target: UnitCard, amount: number) => Effect;
  constructor(owner: UnitCard, makeEffect: (target: UnitCard, amount: number) => Effect, amount: number, name: string) {
    super(owner);
    this.makeEffect = makeEffect;
    this.baseMagic = amount;
    this.magic = amount;
    this.name = name;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner && game.cardsByPos(this.owner.owner.side, this.owner.fieldPos.row, this.owner.fieldPos.column + 1)) {
      new ApplyEffectAction(this, game.cardsByPos(this.owner.owner.side, this.owner.fieldPos.row, this.owner.fieldPos.column + 1)[0], t => this.makeEffect(t, this.magic)).stack();
    }
  }
}

export class ApplyEffectToAlliesAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.applyEffectToAllies`;
  get text() { return `Apply ${this.magic} ${this.name} to all allies`; }
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
    if(ac instanceof HitAction && ac.source == this.owner) {
      for(let i of game.cardsByPos(this.owner.owner.side).filter(x => x instanceof CompanionCard && x != this.owner)) {
        new ApplyEffectAction(this, i, t => this.makeEffect(t, this.magic)).stack();
      }
    }
  }
}

export class ApplyEffectToRandomEnemyWhenHitAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.applyEffectToRandomEnemyWhenHit`;
  get text() { return `When hit, apply ${this.magic} ${this.name} to a random enemy`; }
  isReaction = false;
  owner: UnitCard;
  baseMagic: number;
  magic: number;
  name: string;
  makeEffect: (target: UnitCard, amount: number) => Effect;
  constructor(owner: UnitCard, makeEffect: (target: UnitCard, amount: number) => Effect, amount: number, name: string) {
    super(owner);
    this.makeEffect = makeEffect;
    this.baseMagic = amount;
    this.magic = amount;
    this.name = name;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
      let board = game.cardsByPos(this.owner.fieldPos.side == 0 ? 1 : 0);
      new ApplyEffectAction(this, board[Math.floor(Math.random() * board.length)], t => this.makeEffect(t, this.magic)).stack();
    }
  }
}

export class GainEqualEffectWhenHealthLostAbility extends Ability {
  id = `slugfrost.gainEqualEffectWhenHealthLost`;
  get text() { return `When health lost, apply equal, gain equal ${this.name}`; }
  isReaction = false;
  owner: UnitCard;
  name: string;
  makeEffect: (target: UnitCard, amount: number) => Effect;
  constructor(owner: UnitCard, makeEffect: (target: UnitCard, amount: number) => Effect, name: string) {
    super(owner);
    this.makeEffect = makeEffect;
    this.name = name;
  }
  use(ac: Action) {
    if(ac instanceof TakeDamageAction && ac.target == this.owner && ac.amount > 0) {
      new ApplyEffectAction(this, this.owner, t => this.makeEffect(t, ac.amount)).stack();
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

export class ModifyMaxCounterAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.modifyMaxCounter`;
  get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Max Counter`; }
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
      new ModifyMaxCounterAction(ac.target, this.magic).stack();
    }
  }
}

export class ModifyAttackAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.modifyAttack`;
  get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Attack`; }
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
  get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Attack when hit`; }
  isReaction = false;
  owner: HasAttack;
  baseMagic: number;
  magic: number;
  constructor(owner: HasAttack, amount: number) {
    super(owner);
    this.baseMagic = amount;
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
  get text() { return `When hit, ${this.magic >= 0 ? "+" : ""}${this.magic} Attack to the attacker`; }
  isReaction = false;
  owner: HasAttack;
  baseMagic: number;
  magic: number;
  constructor(owner: HasAttack, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.isAttack && hasAttack(ac.source)) {
      new ModifyAttackAction(ac.source, this.magic).stack();
    }
  }
}

export class GainAttackWhenAllyDiesAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.gainAttackWhenAllyDies`;
  get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Attack when an ally dies`; }
  isReaction = false;
  owner: HasAttack;
  baseMagic: number;
  magic: number;
  constructor(owner: HasAttack, amount: number) {
    super(owner);
    this.baseMagic = amount;
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
  text = "Escape!";
  isReaction = false;
  use(ac: Action) {
    if(ac instanceof TriggerAction && ac.card == this.owner && this.owner instanceof UnitCard) {
      this.owner.die(this); // haha
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

export class TriggerWhenAllyInRowAttacksAbility extends Ability {
  id = `slugfrost.triggerWhenAllyInRowAttacks`;
  text = "Trigger when an ally in the row attacks";
  isReaction = true;
  owner: UnitCard;
  use(ac: Action) {
    if(ac instanceof TriggerAction && !ac.card.abilities.find(x => x instanceof TriggerWhenAllyInRowAttacksAbility) && ac.card instanceof UnitCard && ac.card.owner.side == this.owner.owner.side && ac.card.fieldPos.row == this.owner.fieldPos.row) {
      this.owner.trigger();
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
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.isAttack) {
      new DrawAction(this.owner.owner, this.magic).stack();
    }
  }
}

export class WhileActiveAddAttackToAlliesAbility extends Ability {
  id = `slugfrost.whileActiveAddAttackToAllies`;
  get text() { return `While active, add ${this.amount} Attack to all allies`; }
  amount: number;
  owner: UnitCard;
  isReaction = false;
  constructor(owner: UnitCard, amount: number) {
    super(owner);
    this.amount = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.isAttack && ac.source.owner.side == this.owner.owner.side) {
      ac.amount += this.amount;
    } else if(ac instanceof GetDisplayedAttackAction && ac.card.owner.side == this.owner.owner.side && !(hasAttack(this.owner) && ac.card == this.owner)) {
      ac.amount += this.amount;
    }
  }
}

export class ModifyFrenzyAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.modifyFrenzy`;
  get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Frenzy`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner && ac.target instanceof UnitCard) {
      new ModifyFrenzyAction(ac.target, this.magic).stack();
    }
  }
}

export class DropBlingWhenHitAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.dropBlingWhenHit`;
  get text() { return `Drop ${this.magic} Bling when hit`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target == this.owner && ac.target instanceof UnitCard) {
      game.players[0].blings += this.magic;
    }
  }
}

export class RestoreAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.restore`;
  get text() { return `Restore ${this.magic} Health`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner && ac.target instanceof CompanionCard) {
      new RestoreAction(ac.target, this.magic, this).stack();
    }
  }
}

export class ModifyMaxHealthAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.modifyMaxHealth`;
  get text() { return `${this.magic >= 0 ? "+" : ""}${this.magic} Max HP`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner && ac.target instanceof CompanionCard) {
      new ModifyMaxHealthAction(ac.target, this.magic, this).stack();
    }
  }
}

export class RestoreAlliesAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.restoreAllies`;
  get text() { return `Restore ${this.magic} Health to all allies`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner) {
      for(let i of game.cardsByPos(this.owner.owner.side).filter(x => x instanceof CompanionCard && x != this.owner)) {
        new RestoreAction(i as CompanionCard, this.magic, this).stack();
      }
    }
  }
}

export class RestoreAlliesInRowOnKillAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.restoreAlliesInRowOnKill`;
  get text() { return `On kill, restore ${this.magic} Health to self & allies in row`; }
  isReaction = false;
  owner: CompanionCard;
  baseMagic: number;
  magic: number;
  constructor(owner: CompanionCard, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof DieAction && (ac.source == this.owner || (ac.source instanceof Ability && ac.source.owner == this.owner))) {
      for(let i of game.cardsByPos(this.owner.owner.side, this.owner.fieldPos.row).filter(x => x instanceof CompanionCard)) {
        new RestoreAction(i as CompanionCard, this.magic, this).stack();
      }
    }
  }
}

export class AlliesRestoreWhenHitAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.alliesRestoreWhenHit`;
  get text() { return `When an ally is hit, they restore ${this.magic} Health`; }
  isReaction = false;
  baseMagic: number;
  magic: number;
  constructor(owner: Card, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.target.owner.side == this.owner.owner.side && ac.target instanceof CompanionCard && (this.owner as UnitCard).fieldPos) {
      new RestoreAction(ac.target, this.magic, this).stack();
    }
  }
}

export class LifelinkFrontAllyAbility extends Ability {
  id = `slugfrost.lifelinkFrontAlly`;
  get text() { return `Restore Health to front ally equal to damage`; }
  isReaction = false;
  constructor(owner: Card) {
    super(owner);
  }
  use(ac: Action) {
    if(ac instanceof TakeDamageAction && ac.source == this.owner) {
      let front = game.cardsByPos(this.owner.owner.side, ac.target.fieldPos.row)[0];
      if(front && front instanceof CompanionCard) new RestoreAction(front, ac.amount, this).stack();
    }
  }
}

export class CleanseAlliesAbility extends Ability {
  id = `slugfrost.cleanseAllies`;
  get text() { return `Remove debuffs from allies`; }
  isReaction = false;
  constructor(owner: Card) {
    super(owner);
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.source == this.owner) {
      for(let i of game.cardsByPos(this.owner.owner.side).filter(x => x instanceof CompanionCard && x != this.owner)) {
        for(let j of i.curEffects.filter(x => !x.isBuff)) {
          new ApplyEffectAction(this, i, t => new CustomEffect(t, -1 * j.amount, j.id)).stack();
        }
      }
    }
  }
}

export class DealDamageBackWhenHitAbility extends Ability {
  id = `slugfrost.dealDamageBackWhenHit`;
  get text() { return `When hit, deal equal damage back`; }
  isReaction = false;
  owner: UnitCard;
  constructor(owner: UnitCard) {
    super(owner);
  }
  use(ac: Action) {
    if(ac instanceof TakeDamageAction && ac.target == this.owner && ac.amount > 0 && ac.source instanceof UnitCard) {
      new DealDamageAction(this, ac.source, ac.amount).queue();
    }
  }
}

export class BarrageToAlliesAbility extends Ability {
  id = `slugfrost.targeting.barrageToAllies`;
  text = "Allies gain Barrage";
  isReaction = false;
  use(ac: Action) {
    if(ac instanceof FindTargetsAction && ac.source instanceof UnitCard && ac.source.owner.side == this.owner.owner.side && (this.owner as UnitCard).fieldPos) {
      ac.targets = game.cardsByPos((ac.targets[0] as UnitCard).fieldPos.side, (ac.targets[0] as UnitCard).fieldPos.row);
    }
  }
}

export class IncreaseDamageByHealthAbility extends Ability {
  id = `slugfrost.increaseDamageByHealth`;
  text = "Add Health to Attack";
  isReaction = false;
  owner: CompanionCard;
  constructor(owner: CompanionCard) {
    super(owner);
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.isAttack && ac.source == this.owner) {
      ac.amount += this.owner.curHealth;
    } else if(ac instanceof GetDisplayedAttackAction && hasAttack(this.owner) && ac.card == this.owner) {
      ac.amount += this.owner.curHealth;
    }
  }
}

export class ResistEffectAbility extends Ability {
  id = `slugfrost.resistEffect`;
  get text() {return `Max ${this.amount} ${this.effectId.split(".")[1]}`;}
  isReaction = false;
  owner: UnitCard;
  amount: number;
  effectId: string;
  constructor(owner: UnitCard, amount: number, effectId: string) {
    super(owner);
    this.amount = amount;
    this.effectId = effectId;
  }
  use(ac: Action) {
    if(ac instanceof ApplyEffectAction && ac.target == this.owner) {
      ac._makeEffect = (t: UnitCard) => {
        let effect = ac.makeEffect(t);
        if(effect.id == this.effectId) effect.amount = Math.min(effect.amount, this.amount - (t.curEffects.find(x => x.id == effect.id)?.amount || 0));
        return effect;
      }
    }
  }
}

export class IncreaseDamageWhileHurtAbility extends Ability implements HasMagicNumber {
  id = `slugfrost.increaseDamageWhileHurt`;
  get text() { return `Increase Attack by ${this.magic} while hurt`; }
  isReaction = false;
  owner: HasAttack;
  magic: number;
  baseMagic: number;
  constructor(owner: HasAttack, amount: number) {
    super(owner);
    this.baseMagic = amount;
    this.magic = amount;
  }
  use(ac: Action) {
    if(ac instanceof HitAction && ac.isAttack && ac.source == this.owner) {
      ac.amount += this.magic;
    } else if(ac instanceof GetDisplayedAttackAction && ac.card == this.owner) {
      ac.amount += this.magic;
    }
  }
}

export class SummonUnitWhenKilledAbility extends Ability {
  id = `slugfrost.summonUnitWhenKilled`;
  text = ""; // keep this on the down low
  isReaction = false;
  owner: UnitCard;
  makeUnit: () => UnitCard;
  constructor(owner: UnitCard, makeUnit: () => UnitCard) {
    super(owner);
    this.makeUnit = makeUnit;
  }
  use(ac: Action) {
    if(ac instanceof DieAction && ac.card == this.owner) {
      let u = this.makeUnit();
      u.init();
      new SummonUnitAction(u, this.owner.owner.side, this.owner.fieldPos.row, this.owner.fieldPos.column).stack();
      // move other cards backward
      for(let col = this.owner.fieldPos.column + 1; col <= 2; col++) {
        let on = game.cardsByPos(this.owner.fieldPos.side, this.owner.fieldPos.row, col)[0];
        if(!on) break;
        on.fieldPos.column++;
        let el = getId(`slot-${this.owner.owner.side}-${col - 1}-${this.owner.fieldPos.row}`);
        on.element.style.left = el.offsetLeft + el.offsetWidth * 0.25 + "px";
      }
    }
  }
}

export class WildAbility extends Ability {
  id = `slugfrost.wild`;
  text = "Wild";
  isReaction = false;
  owner: UnitCard;
  constructor(owner: UnitCard) {
    super(owner);
  }
  use(ac: Action) {
    if(ac instanceof DieAction && ac.card != this.owner && ac.card.abilities.find(x => x instanceof WildAbility)) {
      new ModifyFrenzyAction(this.owner, 1).stack();
    }
  }
}