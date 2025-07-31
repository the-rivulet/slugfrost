import type { Ability } from "./ability.js";
import type { Card } from "./card.js";
import { log, Player } from "./game.js";

export abstract class Charm {
  abstract name: string;
  owner?: Player;
  attachedTo?: Card;
  text?: string;
  abstract applicable: (card: Card) => boolean;
  abstract abilities: Ability[];
  constructor(owner: Player) {
    this.owner = owner;
  }
  whenApplied?: (card: Card) => void;
  apply(card: Card) {
    this.attachedTo = card;
    card.charms.push(this);
    for(let i of this.abilities) i.owner = card;
    card.abilities.push(...this.abilities);
    if(this.whenApplied) this.whenApplied(card);
    card.updateElement();
  }
}