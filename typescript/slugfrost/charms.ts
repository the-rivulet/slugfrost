import { ConsumeAbility, Effect, SnowEffect } from "../ability.js";
import { Card, CompanionCard, ItemCard, UnitCard } from "../card.js";
import { Charm } from "../charm.js";
import { HasAttack, hasAttack, HasCounter, hasCounter, Player } from "../game.js";
import { ApplyEffectAbility, SmackbackAbility } from "./abilities.js";
import { BomEffect, FrostEffect } from "./effects.js";

abstract class EffectCharm extends Charm {
  applicable = (c: Card) => true;
  whenApplied = (card: Card) => {
    if(hasAttack(card)) return;
    card["baseAttack"] = 0;
    card["curAttack"] = 0;
  }
}
export class BomCharm extends EffectCharm { //wa
  name = "Bom";
  abilities = [new ApplyEffectAbility(undefined, (t, x) => new BomEffect(t, x), 1)];
}
export class FrostCharm extends EffectCharm {
  name = "Frost";
  abilities = [new ApplyEffectAbility(undefined, (t, x) => new FrostEffect(t, x), 1)];
}
export class SnowballCharm extends EffectCharm {
  name = "Snowball";
  abilities = [new ApplyEffectAbility(undefined, (t, x) => new SnowEffect(t, x), 1)];
}
export class BalanceCharm extends Charm {
  name = "Balance";
  text = "Attack, Health, Counter = 3";
  applicable = (c: Card) => c instanceof CompanionCard && hasAttack(c) && hasCounter(c);
  whenApplied = (card: CompanionCard & HasAttack & HasCounter) => {
    card.baseAttack = 3;
    card.curAttack = 3;
    card.baseHealth = 3;
    card.curHealth = 3;
    card.maxHealth = 3;
    card.baseCounter = 3;
    card.curCounter = 3;
    card.maxCounter = 3;
  }
  abilities = [];
}
export class BattleCharm extends Charm {
  name = "Battle";
  text = "+2 Attack";
  applicable = (c: Card) => hasAttack(c);
  whenApplied = (card: HasAttack) => {
    card.baseAttack += 2;
    card.curAttack += 2;
  }
  abilities = [];
}
export class HeartCharm extends Charm {
  name = "Heart";
  text = "+5 Health";
  applicable = (c: Card) => c instanceof CompanionCard;
  whenApplied = (card: CompanionCard) => {
    card.baseHealth += 5;
    card.curHealth += 5;
    card.maxHealth += 5;
  }
  abilities = [];
}
export class FrenzyCharm extends Charm {
  name = "Frenzy";
  applicable = (c: Card) => c instanceof ItemCard && !c.abilities.find(x => x.id == `base.consume`);
  whenApplied = (card: ItemCard) => {
    card.frenzy += 2;
  }
  abilities = [new ConsumeAbility(undefined)];
}
export class PunchfistCharm extends Charm {
  name = "Punchfist";
  applicable = (c: Card) => c instanceof UnitCard && !c.abilities.find(x => x.id == `slugfrost.smackback`);
  abilities = [new SmackbackAbility(undefined)];
}