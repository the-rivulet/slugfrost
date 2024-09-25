import type { Ability } from "./ability.js";
import type { Card } from "./card.js";

export abstract class Charm {
  abstract name: string;
  owner?: Card;
  text?: string;
  abstract applicable: (card: Card) => boolean;
  abstract abilities: Ability[];
  whenApplied?: (card: Card) => void;
  apply(card: Card) {
    this.owner = card;
    card.charms.push(this);
    card.abilities.push(...this.abilities);
    if(this.whenApplied) this.whenApplied(card);
  }
}