import { SnowEffect } from "../ability.js";
import { Card, ClunkerCard, CompanionCard, ItemCard, UnitCard } from "../card.js";
import { type Player, type HasAttack, type HasCounter, type HasCondition, hasCounter, hasAttack } from "../game.js";
import { ApplyEffectAbility, TempModifyCounterAbility, IncreaseWhenHitAbility, ModifyAttackAbility, EscapeFromBattleAbility, ModifyAttackWhenHitAbility, SmackbackAbility, GainAttackWhenHitAbility, DrawWhenHitAbility } from "./abilities.js";
import { BomEffect } from "./effects.js";

// Snowdwellers' starting deck
export class ScrappySwordCard extends ItemCard implements HasAttack {
  name = "Scrappy Sword";
  id = `slugfrost.scrappySword`;
  text = "A traditional trusty weapon";
  baseAttack = 2;
}

export class SnowStickCard extends ItemCard implements HasAttack {
  name = "Snow Stick";
  id = `slugfrost.snowStick`;
  baseAttack = 1;
  abilities = [new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 2, "Snow")];
}

export class SunRodCard extends ItemCard implements HasCondition {
  name = "Sun Rod";
  id = `slugfrost.sunRod`;
  abilities = [new TempModifyCounterAbility(this, -2)];
  condition = (card: Card) => card instanceof UnitCard && hasCounter(card);
}

export class FlamewaterCard extends ItemCard {
  name = "Flamewater";
  id = `slugfrost.flamewater`;
  abilities = [new ModifyAttackAbility(this, 1)];
  condition = (card: Card) => hasAttack(card);
}

export class WoodheadCard extends ClunkerCard {
  name = "Woodhead";
  id = `slugfrost.woodhead`;
  text = "Does nothing, but will take a hit for you :)";
  baseScrap = 1;
}

// Pets
export class SneezleCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Sneezle";
  id = `slugfrost.sneezle`;
  baseHealth = 6;
  baseAttack = 2;
  baseCounter = 3;
  abilities = [new DrawWhenHitAbility(this, 1)];
}

// Misc Companions
export class FoxeeCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Foxee";
  id = `slugfrost.foxee`;
  baseHealth = 4;
  baseAttack = 1;
  baseCounter = 3;
  frenzy = 3;
}

export class BijiCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Biji";
  id = `slugfrost.biji`;
  baseHealth = 8;
  baseAttack = 0;
  baseCounter = 4;
  abilities = [
    new ApplyEffectAbility(this, (t, x) => new BomEffect(t, x), 3, "Bom"),
    new IncreaseWhenHitAbility(this, 1)
  ];
}

// The Pengoons
export class ChungoonCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Chungoon";
  id = `slugfrost.chungoon`;
  baseHealth = 6;
  baseAttack = 1;
  baseCounter = 3;
  abilities = [new GainAttackWhenHitAbility(this, 1)];
}

export class GogongCard extends CompanionCard implements HasAttack {
  name = "Gogong";
  id = `slugfrost.gogong`;
  baseHealth = 5;
  baseAttack = 2;
  abilities = [new SmackbackAbility(this)];
}

export class PengoonCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Pengoon";
  id = `slugfrost.pengoon`;
  baseHealth = 2;
  baseAttack = 1;
  baseCounter = 2;
}

export class WaddlegoonsCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Waddlegoons";
  id = `slugfrost.waddlegoons`;
  baseHealth = 9;
  baseAttack = 1;
  baseCounter = 3;
  frenzy = 3;
}

export class WildSnoolfCard extends CompanionCard implements HasAttack, HasCounter {
  name = "W.Snoolf";
  id = `slugfrost.wildSnoolf`;
  baseHealth = 4;
  baseAttack = 1;
  baseCounter = 3;
  abilities = [new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 2, "Snow")];
}

export class BigPengCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Big Peng";
  id = `slugfrost.bigPeng`;
  baseHealth = 10;
  baseAttack = 1;
  baseCounter = 4;
  abilities = [new GainAttackWhenHitAbility(this, 1)];
}

// Misc Enemies
export class GoblingCard extends CompanionCard implements HasCounter {
  name = "Gobling";
  id = `slugfrost.gobling`;
  baseHealth = 6;
  baseCounter = 4;
  abilities = [new EscapeFromBattleAbility(this)];
}

export class NakedGnomeCard extends CompanionCard {
  name = "Naked Gnome";
  id = `slugfrost.nakedGnome`;
  text = "Does absolutely nothing...";
  baseHealth = 1;
}