import type { Card } from "./card.js";

export abstract class Charm {
  abstract name: string;
  owner?: Card;
  abstract text: string;
  abstract applicable: (card: Card) => boolean;
  abstract whenApplied: (card: Card) => void;
  apply(card: Card) {
    this.owner = card;
    card.charms.push(this);
  }
}