import { CompanionCard } from "../card.js";
export class FoxeeCard extends CompanionCard {
    constructor(owner) {
        super(owner);
        this.name = "Foxee";
        this.id = `slugfrost.foxee`;
        this.baseHealth = 4;
        this.baseAttack = 1;
        this.baseCounter = 3;
        this.frenzy = 3;
    }
}
