export class Charm {
    apply(card) {
        this.owner = card;
        card.charms.push(this);
    }
}
