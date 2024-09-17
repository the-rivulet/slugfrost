import { FindTargetsAction, TempModifyCounterAction, ApplyEffectAction } from "./action.js";
import { game, Side } from "./game.js";
export class Ability {
    constructor(owner) {
        this.owner = owner;
    }
}
export class Effect {
    get asAbility() { return new UniqueAbility(`base.effectAbility.` + this.id, this.lastAppliedBy.owner, this.text, false, this.use); }
    constructor(owner, amount) {
        this.owner = owner;
        this.amount = amount;
    }
}
export class SnowEffect extends Effect {
    constructor() {
        super(...arguments);
        this.id = `base.snow`;
        this.name = "Snow";
        this.text = "Halts counter and reactions";
        this.color = "#77f";
        this.side = Side.right;
        this.isBuff = false;
    }
    use(ac) {
        if (ac instanceof TempModifyCounterAction && ac.amount < 0 && ac.target == this.owner) {
            let change = Math.min(this.amount, -1 * ac.amount);
            ac.amount += change;
            new ApplyEffectAction(this.asAbility, this.owner, t => new SnowEffect(t, -1 * change)).stack();
        }
    }
}
export class CustomEffect extends Effect {
    constructor(owner, amount, id, name = "", text = "", color = "", side = Side.left, isBuff = false, use) {
        super(owner, amount);
        this.id = id;
        this.name = name;
        this.text = text;
        this.color = color;
        this.side = side;
        this.isBuff = isBuff;
        this.use = use;
    }
}
export class UniqueAbility extends Ability {
    constructor(id, owner, text, isReaction, use) {
        super(owner);
        this.id = `base.uniqueAbility`;
        this.id = id;
        this.text = text;
        this.isReaction = isReaction;
        this.use = use;
    }
}
export class HitsAllEnemiesAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `base.targeting.hitsAllEnemies`;
        this.text = "Hits all enemies";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof FindTargetsAction && ac.source == this.owner) {
            ac.targets = game.cardsByPos(ac.targets[0].fieldPos.side);
        }
    }
}
export class BarrageAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `base.targeting.barrage`;
        this.text = "Barrage";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof FindTargetsAction && ac.source == this.owner) {
            ac.targets = game.cardsByPos(ac.targets[0].fieldPos.side, ac.targets[0].fieldPos.row);
        }
    }
}
export class AimlessAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `base.targeting.aimless`;
        this.text = "Aimless";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof FindTargetsAction && ac.source == this.owner) {
            ac.targets = game.cardsByPos(ac.targets[0].fieldPos.side, ac.targets[0].fieldPos.row);
            ac.random = 1;
        }
    }
}
export class LongshotAbility extends Ability {
    constructor() {
        super(...arguments);
        this.id = `base.targeting.longshot`;
        this.text = "Longshot";
        this.isReaction = false;
    }
    use(ac) {
        if (ac instanceof FindTargetsAction && ac.source == this.owner) {
            ac.targets = [game.cardsByPos(ac.targets[0].fieldPos.side, ac.targets[0].fieldPos.row).sort((x, y) => y.fieldPos.column - x.fieldPos.column)[0]];
        }
    }
}
export class ConsumeAbility extends Ability {
    constructor(owner) {
        super(owner);
        this.id = `base.consume`;
        this.text = "Consume";
        this.isReaction = false;
    }
    use(ac) { }
}
