import { AimlessAbility, BarrageAbility, ConsumeAbility, HitsAllEnemiesAbility, LongshotAbility, SnowEffect } from "../ability.js";
import { ClunkerCard, CompanionCard, ItemCard, UnitCard } from "../card.js";
import { hasCounter, hasAttack } from "../game.js";
import { ApplyEffectAbility, TempModifyCounterAbility, IncreaseWhenHitAbility, ModifyAttackAbility, EscapeFromBattleAbility, SmackbackAbility, GainAttackWhenHitAbility, DrawWhenHitAbility, WhileActiveAddAttackToAlliesAbility, ModifyFrenzyAbility, ModifyMaxCounterAbility, TriggerWhenAllyInRowAttacksAbility, ApplyEffectToRandomEnemyWhenHitAbility, DropBlingWhenHitAbility, RestoreAlliesAbility, CleanseAlliesAbility, LifelinkFrontAllyAbility, ModifyMaxHealthAbility, ApplyEffectToAlliesAbility, DealDamageBackWhenHitAbility, BarrageToAlliesAbility, AlliesRestoreWhenHitAbility, RestoreAlliesInRowOnKillAbility, IncreaseDamageByHealthAbility, GainEqualEffectWhenHealthLostAbility, ApplyEffectToAllyBehindAbility, ApplyEffectEqualToDamageAbility, ResistEffectAbility, IncreaseDamageWhileHurtAbility, SummonUnitWhenKilledAbility } from "./abilities.js";
import { BomEffect, FrostEffect, SpiceEffect } from "./effects.js";
export class ScrappySwordCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Scrappy Sword";
        this.id = `slugfrost.scrappySword`;
        this.text = "A traditional trusty weapon";
        this.baseAttack = 2;
    }
}
export class SnowStickCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Snow Stick";
        this.id = `slugfrost.snowStick`;
        this.baseAttack = 1;
        this.abilities = [new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 2, "Snow")];
    }
}
export class SunRodCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Sun Rod";
        this.id = `slugfrost.sunRod`;
        this.abilities = [new TempModifyCounterAbility(this, -2)];
        this.condition = (card) => card instanceof UnitCard && hasCounter(card);
    }
}
export class FlamewaterCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Flamewater";
        this.id = `slugfrost.flamewater`;
        this.abilities = [new ModifyAttackAbility(this, 1)];
        this.condition = (card) => hasAttack(card);
    }
}
export class WoodheadCard extends ClunkerCard {
    constructor() {
        super(...arguments);
        this.name = "Woodhead";
        this.id = `slugfrost.woodhead`;
        this.text = "Does nothing, but will take a hit for you :)";
        this.baseScrap = 1;
    }
}
export class SneezleCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Sneezle";
        this.id = `slugfrost.sneezle`;
        this.baseHealth = 6;
        this.baseAttack = 2;
        this.baseCounter = 3;
        this.abilities = [new DrawWhenHitAbility(this, 1)];
    }
}
export class FoxeeCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Foxee";
        this.id = `slugfrost.foxee`;
        this.baseHealth = 4;
        this.baseAttack = 1;
        this.baseCounter = 3;
        this.frenzy = 3;
    }
}
export class BijiCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Biji";
        this.id = `slugfrost.biji`;
        this.baseHealth = 8;
        this.baseAttack = 0;
        this.baseCounter = 4;
        this.abilities = [
            new ApplyEffectAbility(this, (t, x) => new BomEffect(t, x), 3, "Bom"),
            new IncreaseWhenHitAbility(this, 1)
        ];
    }
}
export class BigBerryCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Big Berry";
        this.id = `slugfrost.bigBerry`;
        this.baseHealth = 10;
        this.baseAttack = 5;
        this.baseCounter = 4;
        this.abilities = [new RestoreAlliesInRowOnKillAbility(this, 2)];
    }
}
export class BonnieCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Big Berry";
        this.id = `slugfrost.bigBerry`;
        this.baseHealth = 4;
        this.baseCounter = 4;
        this.abilities = [
            new RestoreAlliesAbility(this, 2),
            new CleanseAlliesAbility(this)
        ];
    }
}
export class GojiberCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Gojiber";
        this.id = `slugfrost.gojiber`;
        this.baseHealth = 7;
        this.baseAttack = 0;
        this.abilities = [
            new IncreaseDamageByHealthAbility(this),
            new SmackbackAbility(this)
        ];
    }
}
export class FirefistCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Firefist";
        this.id = `slugfrost.firefist`;
        this.baseHealth = 12;
        this.baseAttack = 2;
        this.baseCounter = 5;
        this.abilities = [new GainEqualEffectWhenHealthLostAbility(this, (t, x) => new SpiceEffect(t, x), "Spice")];
    }
}
export class PyraCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Pyra";
        this.id = `slugfrost.pyra`;
        this.baseHealth = 6;
        this.baseCounter = 4;
        this.abilities = [new ApplyEffectToAllyBehindAbility(this, (t, x) => new SpiceEffect(t, x), 4, "Spice")];
    }
}
export class SnobbleCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Snobble";
        this.id = `slugfrost.snobble`;
        this.baseHealth = 5;
        this.baseAttack = 2;
        this.baseCounter = 4;
        this.abilities = [new ApplyEffectEqualToDamageAbility(this, (t, x) => new SnowEffect(t, x), "Snow")];
    }
}
export class BlazeTeaCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Blaze Tea";
        this.id = `slugfrost.blazeTea`;
        this.abilities = [
            new ModifyFrenzyAbility(this, 1),
            new ModifyMaxCounterAbility(this, 1),
            new ConsumeAbility(this)
        ];
        this.condition = (card) => card instanceof UnitCard && hasCounter(card);
    }
}
export class BerryBasketCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Berry Basket";
        this.id = `slugfrost.berryBasket`;
        this.abilities = [
            new RestoreAlliesAbility(this, 2),
            new CleanseAlliesAbility(this)
        ];
    }
}
export class BerryBladeCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Berry Blade";
        this.id = `slugfrost.berryBlade`;
        this.baseAttack = 4;
        this.abilities = [new LifelinkFrontAllyAbility(this)];
    }
}
export class BlizzardBottleCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Blizzard Bottle";
        this.id = `slugfrost.blizzardBottle`;
        this.baseAttack = 0;
        this.abilities = [new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 3, "Snow")];
    }
}
export class FrostBellCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Frost Bell";
        this.id = `slugfrost.frostBell`;
        this.baseAttack = 0;
        this.abilities = [
            new ApplyEffectAbility(this, (t, x) => new FrostEffect(t, x), 2, "Frost"),
            new BarrageAbility(this)
        ];
    }
}
export class FrostbloomCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Frostbloom";
        this.id = `slugfrost.frostbloom`;
        this.baseAttack = 0;
        this.abilities = [new ApplyEffectAbility(this, (t, x) => new FrostEffect(t, x), 3, "Frost")];
        this.condition = (card) => hasAttack(card);
    }
}
export class MoltenDipCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Molten Dip";
        this.id = `slugfrost.moltenDip`;
        this.abilities = [
            new ModifyAttackAbility(this, 2),
            new BarrageAbility(this),
            new ConsumeAbility(this)
        ];
        this.condition = (card) => hasAttack(card);
    }
}
export class SlapcrackersCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Slapcrackers";
        this.id = `slugfrost.slapcrackers`;
        this.baseAttack = 1;
        this.frenzy = 4;
        this.abilities = [new AimlessAbility(this)];
    }
}
export class PinkberryJuiceCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Pinkberry Juice";
        this.id = `slugfrost.pinkberryJuice`;
        this.abilities = [new ModifyMaxHealthAbility(this, 4)];
        this.condition = (card) => card instanceof CompanionCard;
    }
}
export class SunlightDrumCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Sunlight Drum";
        this.id = `slugfrost.sunlightDrum`;
        this.abilities = [
            new TempModifyCounterAbility(this, -1),
            new BarrageAbility(this)
        ];
        this.condition = (card) => card instanceof UnitCard && hasCounter(card);
    }
}
export class StormbearSpiritCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Stormbear Spirit";
        this.id = `slugfrost.stormbearSpirit`;
        this.text = "Target must have Snow";
        this.baseAttack = 8;
        this.condition = (card) => card.curEffects.find(x => x.id == `base.snow` && x.amount > 0) ? true : false;
    }
}
export class PeppereaperCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "PepperReaper";
        this.id = `slugfrost.peppereaper`;
        this.baseAttack = 1;
        this.abilities = [new ApplyEffectAbility(this, (t, x) => new SpiceEffect(t, x), 4, "Spice")];
        this.condition = (card) => hasAttack(card);
    }
}
export class PepperingCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "PepperRing";
        this.id = `slugfrost.peppering`;
        this.abilities = [new ApplyEffectToAlliesAbility(this, (t, x) => new SpiceEffect(t, x), 2, "Spice")];
        this.condition = (card) => hasAttack(card);
    }
}
export class DragonPepperCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Dragon Pepper";
        this.id = `slugfrost.dragonPepper`;
        this.abilities = [
            new ApplyEffectAbility(this, (t, x) => new SpiceEffect(t, x), 7, "Spice"),
            new ConsumeAbility(this)
        ];
        this.condition = (card) => hasAttack(card);
    }
}
export class SnowcakeCard extends ItemCard {
    constructor() {
        super(...arguments);
        this.name = "Snowcake";
        this.id = `slugfrost.snowcake`;
        this.abilities = [
            new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 5, "Snow"),
            new ConsumeAbility(this)
        ];
    }
}
export class BiteboxCard extends ClunkerCard {
    constructor() {
        super(...arguments);
        this.name = "Bitebox";
        this.id = `slugfrost.bitebox`;
        this.baseScrap = 1;
        this.abilities = [new DealDamageBackWhenHitAbility(this)];
    }
}
export class GachapomperCard extends ClunkerCard {
    constructor() {
        super(...arguments);
        this.name = "Gachapomper";
        this.id = `slugfrost.gachapomper`;
        this.baseScrap = 1;
        this.abilities = [new BarrageToAlliesAbility(this)];
    }
}
export class HeartmistStationCard extends ClunkerCard {
    constructor() {
        super(...arguments);
        this.name = "Heartmist Station";
        this.id = `slugfrost.heartmistStation`;
        this.baseScrap = 1;
        this.abilities = [new AlliesRestoreWhenHitAbility(this, 1)];
    }
}
export class ChungoonCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Chungoon";
        this.id = `slugfrost.chungoon`;
        this.baseHealth = 6;
        this.baseAttack = 1;
        this.baseCounter = 3;
        this.abilities = [new GainAttackWhenHitAbility(this, 1)];
    }
}
export class GogongCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Gogong";
        this.id = `slugfrost.gogong`;
        this.baseHealth = 5;
        this.baseAttack = 2;
        this.abilities = [new SmackbackAbility(this)];
    }
}
export class PengoonCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Pengoon";
        this.id = `slugfrost.pengoon`;
        this.baseHealth = 2;
        this.baseAttack = 1;
        this.baseCounter = 2;
    }
}
export class WaddlegoonsCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Waddlgoons";
        this.id = `slugfrost.waddlegoons`;
        this.baseHealth = 9;
        this.baseAttack = 1;
        this.baseCounter = 3;
        this.frenzy = 3;
    }
}
export class WildSnoolfCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "W.Snoolf";
        this.id = `slugfrost.wildSnoolf`;
        this.baseHealth = 4;
        this.baseAttack = 1;
        this.baseCounter = 3;
        this.abilities = [new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 2, "Snow")];
    }
}
export class BigPengCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Big Peng";
        this.id = `slugfrost.bigPeng`;
        this.boss = true;
        this.baseHealth = 10;
        this.baseAttack = 1;
        this.baseCounter = 4;
        this.abilities = [new GainAttackWhenHitAbility(this, 1)];
    }
}
export class FrostingerCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Frostinger";
        this.id = `slugfrost.frostinger`;
        this.baseHealth = 8;
        this.baseAttack = 1;
        this.baseCounter = 3;
        this.abilities = [new ApplyEffectAbility(this, (t, x) => new FrostEffect(t, x), 1, "Frost")];
    }
}
export class IceLanternCard extends ClunkerCard {
    constructor() {
        super(...arguments);
        this.name = "IceLantern";
        this.id = `slugfrost.iceLantern`;
        this.baseScrap = 1;
        this.abilities = [new WhileActiveAddAttackToAlliesAbility(this, 2)];
    }
}
export class MimikCard extends ClunkerCard {
    constructor() {
        super(...arguments);
        this.name = "Mimik";
        this.id = `slugfrost.mimik`;
        this.baseScrap = 1;
        this.baseAttack = 2;
        this.abilities = [new TriggerWhenAllyInRowAttacksAbility(this)];
    }
}
export class PorkypineCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Porkypine";
        this.id = `slugfrost.porkypine`;
        this.baseHealth = 6;
        this.baseAttack = 2;
        this.baseCounter = 4;
        this.abilities = [new BarrageAbility(this)];
    }
}
export class SnowbirbCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Snowbirb";
        this.id = `slugfrost.snowbirb`;
        this.baseHealth = 4;
        this.baseAttack = 1;
        this.baseCounter = 3;
        this.abilities = [
            new LongshotAbility(this),
            new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 4, "Snow")
        ];
    }
}
export class TheRingerCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Ringer";
        this.id = `slugfrost.theRinger`;
        this.boss = true;
        this.baseHealth = 15;
        this.baseAttack = 5;
        this.baseCounter = 5;
        this.abilities = [
            new ApplyEffectToRandomEnemyWhenHitAbility(this, (t, x) => new FrostEffect(t, x), 2, "Frost"),
            new ResistEffectAbility(this, 1, `base.snow`)
        ];
    }
}
export class BabySnowboCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "BabySnowbo";
        this.id = `slugfrost.babySnowbo`;
        this.baseHealth = 1;
        this.baseAttack = 1;
        this.baseCounter = 2;
    }
}
export class SnowboCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Snowbo";
        this.id = `slugfrost.snowbo`;
        this.baseHealth = 4;
        this.baseAttack = 1;
        this.baseCounter = 2;
        this.abilities = [new AimlessAbility(this)];
    }
}
export class GrouchyCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Grouchy";
        this.id = `slugfrost.grouchy`;
        this.baseHealth = 5;
        this.baseAttack = 2;
        this.baseCounter = 4;
        this.abilities = [new IncreaseDamageWhileHurtAbility(this, 2)];
    }
}
export class WinterWormCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "WinterWorm";
        this.id = `slugfrost.winterWorm`;
        this.baseHealth = 10;
        this.baseAttack = 8;
        this.baseCounter = 6;
        this.abilities = [new GainAttackWhenHitAbility(this, -1)];
    }
}
export class BamTwozleCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Boozle";
        this.id = `slugfrost.bamTwozle`;
        this.boss = true;
        this.baseHealth = 22;
        this.baseAttack = 9;
        this.baseCounter = 6;
        this.abilities = [
            new ApplyEffectAbility(this, (t, x) => new SnowEffect(t, x), 3, "Snow"),
            new ResistEffectAbility(this, 1, `base.snow`),
        ];
    }
}
export class BamboozleCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Bam";
        this.id = `slugfrost.bamboozle`;
        this.boss = true;
        this.baseHealth = 18;
        this.baseAttack = 3;
        this.baseCounter = 5;
        this.abilities = [
            new HitsAllEnemiesAbility(this),
            new ResistEffectAbility(this, 1, `base.snow`),
            new SummonUnitWhenKilledAbility(this, () => new BamTwozleCard(this.owner, false))
        ];
    }
}
export class GoblingCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Gobling";
        this.id = `slugfrost.gobling`;
        this.baseHealth = 6;
        this.baseCounter = 4;
        this.abilities = [new EscapeFromBattleAbility(this), new DropBlingWhenHitAbility(this, 4)];
    }
}
export class NakedGnomeCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Naked Gnome";
        this.id = `slugfrost.nakedGnome`;
        this.text = "The real boss.";
        this.baseHealth = 1;
        this.boss = true;
    }
}
