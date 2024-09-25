import { Charm } from "../charm.js";
import { hasAttack } from "../game.js";
export class BattleCharm extends Charm {
    constructor() {
        super(...arguments);
        this.name = "Battle";
        this.text = "+2 Attack";
        this.applicable = (c) => hasAttack(c);
        this.whenApplied = (card) => { card.baseAttack += 2; };
        this.abilities = [];
    }
}
