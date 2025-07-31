export class Charm {
    constructor(owner) {
        this.owner = owner;
    }
    apply(card) {
        this.attachedTo = card;
        card.charms.push(this);
        for (let i of this.abilities)
            i.owner = card;
        card.abilities.push(...this.abilities);
        if (this.whenApplied)
            this.whenApplied(card);
        card.updateElement();
    }
}
