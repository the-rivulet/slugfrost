import { Card } from "../card.js";
import { Charm } from "../charm.js";
import { HasAttack, hasAttack } from "../game.js";

export class BattleCharm extends Charm {
  name = "Battle";
  text = "+2 Attack";
  applicable = (c: Card) => hasAttack(c);
  whenApplied = (card: Card) => { (card as HasAttack).baseAttack += 2; }
  abilities = [];
}