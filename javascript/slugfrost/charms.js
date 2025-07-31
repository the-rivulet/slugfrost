import { ConsumeAbility, SnowEffect } from "../ability.js";
import { CompanionCard, ItemCard, UnitCard } from "../card.js";
import { Charm } from "../charm.js";
import { hasAttack, hasCounter } from "../game.js";
import { ApplyEffectAbility, SmackbackAbility } from "./abilities.js";
import { BomEffect, FrostEffect } from "./effects.js";
class EffectCharm extends Charm {
    constructor() {
        super(...arguments);
        this.applicable = (c) => true;
        this.whenApplied = (card) => {
            if (hasAttack(card))
                return;
            card["baseAttack"] = 0;
            card["curAttack"] = 0;
        };
    }
}
export class BomCharm extends EffectCharm {
    constructor() {
        super(...arguments);
        this.name = "Bom";
        this.abilities = [new ApplyEffectAbility(undefined, (t, x) => new BomEffect(t, x), 1)];
    }
}
export class FrostCharm extends EffectCharm {
    constructor() {
        super(...arguments);
        this.name = "Frost";
        this.abilities = [new ApplyEffectAbility(undefined, (t, x) => new FrostEffect(t, x), 1)];
    }
}
export class SnowballCharm extends EffectCharm {
    constructor() {
        super(...arguments);
        this.name = "Snowball";
        this.abilities = [new ApplyEffectAbility(undefined, (t, x) => new SnowEffect(t, x), 1)];
    }
}
export class BalanceCharm extends Charm {
    constructor() {
        super(...arguments);
        this.name = "Balance";
        this.text = "Attack, Health, Counter = 3";
        this.applicable = (c) => c instanceof CompanionCard && hasAttack(c) && hasCounter(c);
        this.whenApplied = (card) => {
            card.baseAttack = 3;
            card.curAttack = 3;
            card.baseHealth = 3;
            card.curHealth = 3;
            card.maxHealth = 3;
            card.baseCounter = 3;
            card.curCounter = 3;
            card.maxCounter = 3;
        };
        this.abilities = [];
    }
}
export class BattleCharm extends Charm {
    constructor() {
        super(...arguments);
        this.name = "Battle";
        this.text = "+2 Attack";
        this.applicable = (c) => hasAttack(c);
        this.whenApplied = (card) => {
            card.baseAttack += 2;
            card.curAttack += 2;
        };
        this.abilities = [];
    }
}
export class HeartCharm extends Charm {
    constructor() {
        super(...arguments);
        this.name = "Heart";
        this.text = "+5 Health";
        this.applicable = (c) => c instanceof CompanionCard;
        this.whenApplied = (card) => {
            card.baseHealth += 5;
            card.curHealth += 5;
            card.maxHealth += 5;
        };
        this.abilities = [];
    }
}
export class FrenzyCharm extends Charm {
    constructor() {
        super(...arguments);
        this.name = "Frenzy";
        this.applicable = (c) => c instanceof ItemCard && !c.abilities.find(x => x.id == `base.consume`);
        this.whenApplied = (card) => {
            card.frenzy += 2;
        };
        this.abilities = [new ConsumeAbility(undefined)];
    }
}
export class PunchfistCharm extends Charm {
    constructor() {
        super(...arguments);
        this.name = "Punchfist";
        this.applicable = (c) => c instanceof UnitCard && !c.abilities.find(x => x.id == `slugfrost.smackback`);
        this.abilities = [new SmackbackAbility(undefined)];
    }
}
