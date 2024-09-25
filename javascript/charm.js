export class Charm {
    apply(card) {
        this.owner = card;
        card.charms.push(this);
        card.abilities.push(...this.abilities);
        if (this.whenApplied)
            this.whenApplied(card);
    }
}
