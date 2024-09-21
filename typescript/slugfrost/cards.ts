import { Ability, AimlessAbility, BarrageAbility, ConsumeAbility, HitsAllEnemiesAbility, LongshotAbility, SnowEffect } from "../ability.js";
import { Card, ClunkerCard, CompanionCard, ItemCard, UnitCard } from "../card.js";
import { HasAttack, HasCounter, HasCondition, hasCounter, hasAttack } from "../game.js";
import { ApplyEffectAbility, TempModifyCounterAbility, IncreaseWhenHitAbility, ModifyAttackAbility, EscapeFromBattleAbility, SmackbackAbility, GainAttackWhenHitAbility, DrawWhenHitAbility, WhileActiveAddAttackToAlliesAbility, ModifyFrenzyAbility, ModifyMaxCounterAbility, TriggerWhenAllyInRowAttacksAbility, ApplyEffectToRandomEnemyWhenHitAbility, DropBlingWhenHitAbility, RestoreAlliesAbility, CleanseAlliesAbility, LifelinkFrontAllyAbility, ModifyMaxHealthAbility, ApplyEffectToAlliesAbility, DealDamageBackWhenHitAbility, BarrageToAlliesAbility, AlliesRestoreWhenHitAbility, RestoreAlliesInRowOnKillAbility, IncreaseDamageByHealthAbility, GainEqualEffectWhenHealthLostAbility, ApplyEffectToAllyBehindAbility, ApplyEffectEqualToDamageAbility, ResistEffectAbility, IncreaseDamageWhileHurtAbility, ModifyAttackWhenHitAbility, SummonUnitWhenKilledAbility, WildAbility } from "./abilities.js";
import { BomEffect, FrostEffect, SpiceEffect } from "./effects.js";

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
  abilities = [new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 2)];
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
    new ApplyEffectAbility(this, (t, x) => new BomEffect(t, x), 3),
    new IncreaseWhenHitAbility(this, 1)
  ];
}

export class BigBerryCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Big Berry";
  id = `slugfrost.bigBerry`;
  baseHealth = 10;
  baseAttack = 5;
  baseCounter = 4;
  abilities = [new RestoreAlliesInRowOnKillAbility(this, 2)];
}

export class BonnieCard extends CompanionCard implements HasCounter {
  name = "Bonnie";
  id = `slugfrost.bonnie`;
  baseHealth = 4;
  baseCounter = 4;
  abilities = [
    new RestoreAlliesAbility(this, 2),
    new CleanseAlliesAbility(this)
  ];
}

export class GojiberCard extends CompanionCard implements HasAttack {
  name = "Gojiber";
  id = `slugfrost.gojiber`;
  baseHealth = 7;
  baseAttack = 0;
  abilities = [
    new IncreaseDamageByHealthAbility(this),
    new SmackbackAbility(this)
  ]
}

export class FirefistCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Firefist";
  id = `slugfrost.firefist`;
  baseHealth = 12;
  baseAttack = 2;
  baseCounter = 5;
  abilities = [new GainEqualEffectWhenHealthLostAbility(this, (t, x) => new SpiceEffect(t, x))];
}

export class PyraCard extends CompanionCard implements HasCounter {
  name = "Pyra";
  id = `slugfrost.pyra`;
  baseHealth = 6;
  baseCounter = 4;
  abilities = [new ApplyEffectToAllyBehindAbility(this, (t, x) => new SpiceEffect(t, x), 4)];
}

export class SnobbleCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Snobble";
  id = `slugfrost.snobble`;
  baseHealth = 5;
  baseAttack = 2;
  baseCounter = 4;
  abilities = [new ApplyEffectEqualToDamageAbility(this, (t, x) => new SnowEffect(t, x))];
}

// TODO: Snoffel, Yuki, Wallop?

// Misc Items
export class BlazeTeaCard extends ItemCard implements HasCondition {
  name = "Blaze Tea";
  id = `slugfrost.blazeTea`;
  abilities = [
    new ModifyFrenzyAbility(this, 1),
    new ModifyMaxCounterAbility(this, 1),
    new ConsumeAbility(this)
  ];
  condition = (card: Card) => card instanceof UnitCard && hasCounter(card);
}

export class BerryBasketCard extends ItemCard {
  name = "Berry Basket";
  id = `slugfrost.berryBasket`;
  abilities = [
    new RestoreAlliesAbility(this, 2),
    new CleanseAlliesAbility(this)
  ];
}

export class BerryBladeCard extends ItemCard implements HasAttack {
  name = "Berry Blade";
  id = `slugfrost.berryBlade`;
  baseAttack = 4;
  abilities = [new LifelinkFrontAllyAbility(this)];
}

export class BlizzardBottleCard extends ItemCard implements HasAttack {
  name = "Blizzard Bottle";
  id = `slugfrost.blizzardBottle`;
  baseAttack = 0;
  abilities = [new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 3)];
}

export class FrostBellCard extends ItemCard implements HasAttack {
  name = "Frost Bell";
  id = `slugfrost.frostBell`;
  baseAttack = 0;
  abilities = [
    new ApplyEffectAbility(this, (t, x) => new FrostEffect(t, x), 2),
    new BarrageAbility(this)
  ];
}

export class FrostbloomCard extends ItemCard implements HasAttack, HasCondition {
  name = "Frostbloom";
  id = `slugfrost.frostbloom`;
  baseAttack = 0;
  abilities = [new ApplyEffectAbility(this, (t, x) => new FrostEffect(t, x), 3)];
  condition = (card: Card) => hasAttack(card);
}

export class MoltenDipCard extends ItemCard {
  name = "Molten Dip";
  id = `slugfrost.moltenDip`;
  abilities = [
    new ModifyAttackAbility(this, 2),
    new BarrageAbility(this),
    new ConsumeAbility(this)
  ];
  condition = (card: Card) => hasAttack(card);
}

export class SlapcrackersCard extends ItemCard implements HasAttack {
  name = "Slapcrackers";
  id = `slugfrost.slapcrackers`;
  baseAttack = 1;
  frenzy = 4;
  abilities = [new AimlessAbility(this)];
}

export class PinkberryJuiceCard extends ItemCard implements HasCondition {
  name = "Pinkberry Juice";
  id = `slugfrost.pinkberryJuice`;
  abilities = [new ModifyMaxHealthAbility(this, 4)];
  condition = (card: Card) => card instanceof CompanionCard;
}

export class SunlightDrumCard extends ItemCard implements HasCondition {
  name = "Sunlight Drum";
  id = `slugfrost.sunlightDrum`;
  abilities = [
    new TempModifyCounterAbility(this, -1),
    new BarrageAbility(this)
  ];
  condition = (card: Card) => card instanceof UnitCard && hasCounter(card);
}

export class StormbearSpiritCard extends ItemCard implements HasAttack, HasCondition {
  name = "Stormbear Spirit";
  id = `slugfrost.stormbearSpirit`;
  text = "Target must have Snow";
  baseAttack = 8;
  condition = (card: Card) => card.curEffects.find(x => x.id == `base.snow` && x.amount > 0) ? true : false;
}

export class PeppereaperCard extends ItemCard implements HasAttack, HasCondition {
  name = "PepperReaper";
  id = `slugfrost.peppereaper`;
  baseAttack = 1;
  abilities = [new ApplyEffectAbility(this, (t, x) => new SpiceEffect(t, x), 4)];
  condition = (card: Card) => hasAttack(card);
}

export class PepperingCard extends ItemCard implements HasCondition {
  name = "PepperRing";
  id = `slugfrost.peppering`;
  abilities = [new ApplyEffectToAlliesAbility(this, (t, x) => new SpiceEffect(t, x), 2)];
  condition = (card: Card) => hasAttack(card);
}

export class DragonPepperCard extends ItemCard implements HasCondition {
  name = "Dragon Pepper";
  id = `slugfrost.dragonPepper`;
  abilities = [
    new ApplyEffectAbility(this, (t, x) => new SpiceEffect(t, x), 7),
    new ConsumeAbility(this)
  ];
  condition = (card: Card) => hasAttack(card);
}

export class SnowcakeCard extends ItemCard {
  name = "Snowcake";
  id = `slugfrost.snowcake`;
  abilities = [
    new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 5),
    new ConsumeAbility(this)
  ];
}

// Misc Clunkers
export class BiteboxCard extends ClunkerCard {
  name = "Bitebox";
  id = `slugfrost.bitebox`;
  baseScrap = 1;
  abilities = [new DealDamageBackWhenHitAbility(this)];
}

export class GachapomperCard extends ClunkerCard {
  name = "Gachapomper";
  id = `slugfrost.gachapomper`;
  baseScrap = 1;
  abilities = [new BarrageToAlliesAbility(this)];
}

export class HeartmistStationCard extends ClunkerCard {
  name = "Heartmist Station";
  id = `slugfrost.heartmistStation`;
  baseScrap = 1;
  abilities = [new AlliesRestoreWhenHitAbility(this, 1)];
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
  name = "Waddlgoons";
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
  abilities = [new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 2)];
}

export class BigPengCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Big Peng";
  id = `slugfrost.bigPeng`;
  boss = true;
  baseHealth = 10;
  baseAttack = 1;
  baseCounter = 4;
  abilities = [new GainAttackWhenHitAbility(this, 1)];
}

// The Frost Shades
export class FrostingerCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Frostinger";
  id = `slugfrost.frostinger`;
  baseHealth = 8;
  baseAttack = 1;
  baseCounter = 3;
  abilities = [new ApplyEffectAbility(this, (t, x) => new FrostEffect(t, x), 1)];
}

export class IceLanternCard extends ClunkerCard {
  name = "IceLantern";
  id = `slugfrost.iceLantern`;
  baseScrap = 1;
  abilities = [new WhileActiveAddAttackToAlliesAbility(this, 2)];
}

export class MimikCard extends ClunkerCard implements HasAttack {
  name = "Mimik";
  id = `slugfrost.mimik`;
  baseScrap = 1;
  baseAttack = 2;
  abilities = [new TriggerWhenAllyInRowAttacksAbility(this)];
}

export class PorkypineCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Porkypine";
  id = `slugfrost.porkypine`;
  baseHealth = 6;
  baseAttack = 2;
  baseCounter = 4;
  abilities = [new BarrageAbility(this)];
}

export class SnowbirbCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Snowbirb";
  id = `slugfrost.snowbirb`;
  baseHealth = 4;
  baseAttack = 1;
  baseCounter = 3;
  abilities = [
    new LongshotAbility(this),
    new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 4)
  ];
}

export class TheRingerCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Ringer";
  id = `slugfrost.theRinger`;
  boss = true;
  baseHealth = 15;
  baseAttack = 5;
  baseCounter = 5;
  abilities = [
    new ApplyEffectToRandomEnemyWhenHitAbility(this, (t, x) => new FrostEffect(t, x), 2),
    new ResistEffectAbility(this, 1, `base.snow`)
  ];
}

// Bamboozle
export class BabySnowboCard extends CompanionCard implements HasAttack, HasCounter {
  name = "BabySnowbo";
  id = `slugfrost.babySnowbo`;
  baseHealth = 1;
  baseAttack = 1;
  baseCounter = 2;
}

export class SnowboCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Snowbo";
  id = `slugfrost.snowbo`;
  baseHealth = 4;
  baseAttack = 1;
  baseCounter = 2;
  abilities = [new AimlessAbility(this)];
}

export class GrouchyCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Grouchy";
  id = `slugfrost.grouchy`;
  baseHealth = 5;
  baseAttack = 2;
  baseCounter = 4;
  abilities = [new IncreaseDamageWhileHurtAbility(this, 2)];
}

export class WinterWormCard extends CompanionCard implements HasAttack, HasCounter {
  name = "WinterWorm";
  id = `slugfrost.winterWorm`;
  baseHealth = 10;
  baseAttack = 8;
  baseCounter = 6;
  abilities = [new GainAttackWhenHitAbility(this, -1)];
}

export class BamTwozleCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Boozle";
  id = `slugfrost.bamTwozle`;
  boss = true;
  baseHealth = 22;
  baseAttack = 9;
  baseCounter = 6;
  abilities = [
    new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 3),
    new ResistEffectAbility(this, 1, `base.snow`),
  ]
}

export class BamboozleCard extends CompanionCard implements HasAttack, HasCounter {
  name = "Bam";
  id = `slugfrost.bamboozle`;
  boss = true;
  baseHealth = 18;
  baseAttack = 3;
  baseCounter = 5;
  abilities = [
    new HitsAllEnemiesAbility(this),
    new ResistEffectAbility(this, 1, `base.snow`),
    new SummonUnitWhenKilledAbility(this, () => new BamTwozleCard(this.owner, false))
  ]
}

// Misc Enemies
export class GoblingCard extends CompanionCard implements HasCounter {
  name = "Gobling";
  id = `slugfrost.gobling`;
  baseHealth = 6;
  baseCounter = 4;
  abilities = [new EscapeFromBattleAbility(this), new DropBlingWhenHitAbility(this, 4)];
}

export class NakedGnomeCard extends CompanionCard {
  name = "Naked Gnome";
  id = `slugfrost.nakedGnome`;
  text = "The real boss.";
  baseHealth = 1;
  boss = true;
}