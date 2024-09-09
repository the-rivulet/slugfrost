import { SnowEffect } from "../ability.js";
import { ClunkerCard, CompanionCard, ItemCard, UnitCard } from "../card.js";
import { hasCounter, hasAttack } from "../game.js";
import { ApplyEffectAbility, TempModifyCounterAbility, IncreaseWhenHitAbility, ModifyAttackAbility, EscapeFromBattleAbility, SmackbackAbility, GainAttackWhenHitAbility, DrawWhenHitAbility } from "./abilities.js";
import { BomEffect } from "./effects.js";
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
        this.name = "Waddlegoons";
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
        this.baseHealth = 10;
        this.baseAttack = 1;
        this.baseCounter = 4;
        this.abilities = [new GainAttackWhenHitAbility(this, 1)];
    }
}
export class GoblingCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Gobling";
        this.id = `slugfrost.gobling`;
        this.baseHealth = 6;
        this.baseCounter = 4;
        this.abilities = [new EscapeFromBattleAbility(this)];
    }
}
export class NakedGnomeCard extends CompanionCard {
    constructor() {
        super(...arguments);
        this.name = "Naked Gnome";
        this.id = `slugfrost.nakedGnome`;
        this.text = "Does absolutely nothing...";
        this.baseHealth = 1;
    }
}
