import type { Action } from "./action.js";
import type { Card, ItemCard, UnitCard } from "./card.js";

export function log(text: any) {
  // clear things out if needed
  if(document.getElementById("log").innerHTML.length >= 1000) {
    document.getElementById("log").innerHTML = document.getElementById("log").innerHTML.slice(-1000);
  }
  document.getElementById("log").innerHTML += "<br/>" + text;
  if(text.includes("Error") || text.includes("error")) alert("An error occured! Check the logs.");
}
export function getId<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}
function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i >= 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

class Game {
  players: Player[] = [];
  battlefield: UnitCard[] = [];
  crownedPhase = false;
  actionStack: Action[] = [];
  redrawBellTime = 0;
  waveBellTime = 4;
  wavesLeft: UnitCard[][] = [];
  resolving = false;
  readyToEnd = false;
  cardsByPos(side?: number, row?: number, col?: number) {
    let cards = this.battlefield;
    if(side != undefined) cards = cards.filter(x => x.fieldPos.side == side);
    if(row != undefined) cards = cards.filter(x => x.fieldPos.row == row);
    if(col != undefined) cards = cards.filter(x => x.fieldPos.column == col);
    return cards.sort((a, b) => a.fieldPos.side * 100 - b.fieldPos.side * 100 + a.fieldPos.column * 10 - b.fieldPos.column * 10 + a.fieldPos.row * -1 - b.fieldPos.row * -1);
  }
  resolveNext() { this.actionStack.pop().execute(); }
  resolveAll() {
    this.resolving = this.actionStack.length > 0;
    if(this.resolving) {
      this.resolveNext();
      setTimeout(() => { this.resolveAll(); }, 500);
    } else if(!this.waveBellTime) {
      this.callNextWave();
      this.waveBellTime = 4;
    } else if(this.readyToEnd) {
      this.readyToEnd = false;
      this.endTurn();
    }
  }
  endTurn(side?: number) { try {
    if(this.actionStack.length) {
      this.readyToEnd = true;
      if(!this.resolving) this.resolveAll();
      return;
    }
    if(this.crownedPhase) return;
    let cards = (side != undefined ? this.cardsByPos(side) : this.cardsByPos()).filter(x => hasCounter(x));
    for(let i of cards) {
      i.tickDown();
    }
    this.resolveAll(); // resolve triggers
    this.redrawBellTime = Math.max(0, this.redrawBellTime - 1);
    getId("redrawbell").textContent = "Redraw [" + (this.redrawBellTime || "Charged!") + "]";
    getId("redrawbell").style.color = this.redrawBellTime ? "white" : "gold";
    this.waveBellTime--;
    getId("wavebell").textContent = "Wave [" + this.waveBellTime + "]";
  } catch(e) { log("Error in endTurn(): " + e); } }
  callNextWave() { try {
    let wave = this.wavesLeft[0];
    if(!wave) return;
    this.wavesLeft = this.wavesLeft.slice(1);
    for(let i of wave) {
      let validLanes = [0, 1].filter(x => !this.cardsByPos(i.owner.side, x, 2).length);
      if(validLanes.length) {
        i.init();
        i.summon(validLanes[Math.floor(Math.random() * validLanes.length)], 2);
      } else {
        if(!this.wavesLeft.length) this.wavesLeft.push([]);
        this.wavesLeft[0].push(i);
      }
    }
    this.resolveAll();
    if(!this.wavesLeft.length) getId("wavebell").style.display = "none";
  } catch(e) { log("Error in callNextWave(): " + e); } }
  doCrownedPhase(p: Player) {
    this.crownedPhase = true;
    getId("redrawbell").textContent = "End Crown Phase";
    for(let i = 0; i < p.drawPile.length; i++) {
      let card = p.drawPile[i];
      if(card.crowned) {
        p.drawPile.splice(i, 1);
        p.hand.push(card);
        i--;
      }
    }
    p.updateHand();
  }
}
export const game = new Game();

export class Player {
  side: number;
  deckpack: Card[] = [];
  hand: Card[] = [];
  drawPile: Card[] = [];
  discardPile: Card[] = [];
  constructor(side: number, realPlayer: boolean) {
    this.side = side;
    if(realPlayer) game.players.push(this);
  }
  updateHand() {
    for(let i of this.hand) {
      i.element.style.opacity = "1";
      i.element.style.left = `calc(50% - 110px * ${this.hand.indexOf(i)} + 55px * ${this.hand.length - 2})`;
    }
  }
  discard(card: Card) {
    if(this.hand.includes(card)) this.hand.splice(this.hand.indexOf(card), 1);
    else return;
    this.discardPile.push(card);
    card.element.style.left = "calc(100% - " + card.element.offsetWidth + "px)";
    card.element.style.opacity = "0";
    this.updateHand();
  }
  draw() {
    if(!this.drawPile.length) {
      if(!this.discardPile.length) return false;
      this.drawPile = this.discardPile.slice(0);
      shuffleArray(this.drawPile);
      this.discardPile = [];
    }
    this.hand.push(this.drawPile.pop());
    this.updateHand();
    return true;
  }
}

export interface HasAttack extends Card {
  baseAttack: number;
  curAttack?: number;
}
export function hasAttack(x: Card): x is HasAttack {
  return "baseAttack" in x && typeof x.baseAttack == "number";
}
export interface HasCounter extends UnitCard {
  baseCounter: number;
  curCounter?: number;
}
export function hasCounter(x: UnitCard): x is HasCounter {
  return "baseCounter" in x && typeof x.baseCounter == "number";
}
export interface HasCondition extends ItemCard {
  condition: (card: Card) => boolean;
}
export function hasCondition(x: ItemCard): x is HasCondition {
  return "condition" in x && typeof x.condition == "function";
}

export enum Side { left = "left", right = "right" }

type UIData = {
  currentlyPlaying: Card;
  deselect: () => void;
}
export const ui: UIData = {
  currentlyPlaying: undefined,
  deselect: () => {
    ui.currentlyPlaying?.element.classList.remove("currentlyPlaying");
    ui.currentlyPlaying = undefined;
  }
};
