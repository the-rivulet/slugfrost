import { game, getId, Player, ui, log } from "./game.js";
import { BigPengCard, ChungoonCard, FlamewaterCard, FoxeeCard, GoblingCard, GogongCard, PengoonCard, ScrappySwordCard, SneezleCard, SnowStickCard, SunRodCard, WaddlegoonsCard, WildSnoolfCard, WoodheadCard } from "./slugfrost/cards.js";
import { UnitCard } from "./card.js";

try {
  log("Setting up...");
  for(let i of Array.from(document.getElementsByClassName("slot")) as HTMLElement[]) {
    i.onmousedown = (e) => { try {
      if(game.resolving) return;
      let row = parseInt(i.id.split("-")[3]);
      let col = parseInt(i.id.split("-")[2]);
      if(ui.currentlyPlaying && ui.currentlyPlaying instanceof UnitCard) {
        if(ui.currentlyPlaying.fieldPos) {
          let side = ui.currentlyPlaying.owner.side;
          let on = game.cardsByPos(side, row, col)[0];
          if(on && !(col < 2 && !game.cardsByPos(side, row, col + 1).length)) return;
          let oldRow = ui.currentlyPlaying.fieldPos.row;
          let oldCol = ui.currentlyPlaying.fieldPos.column;
          ui.currentlyPlaying.fieldPos.side = -1; // get rid of the card for now
          // Move other cards in the row forward, if needed.
          for(let c = oldCol + 1; c <= 2; c++) {
            let o = game.cardsByPos(side, oldRow, c)[0];
            if(!o) break;
            log(o.name);
            o.fieldPos.column--;
            let el = getId(`slot-${side}-${c - 1}-${oldRow}`);
            o.element.style.left = el.offsetLeft + el.offsetWidth * 0.25 + "px";
          }
          on = game.cardsByPos(side, row, col)[0]; // update this
          // Move cards in the new row to accomodate the card
          if(!on) {
            while(!game.cardsByPos(side, row, col - 1).filter(x => x != ui.currentlyPlaying).length && col > 0) col--;
          } else if(col < 2 && !game.cardsByPos(side, row, col + 1).length) {
            on.fieldPos.column++;
            on.element.style.left = getId(`slot-${side}-${col + 1}-${row}`).offsetLeft + getId(`slot-${side}-${col + 1}-${row}`).offsetWidth * 0.25 + "px";
          } else log("Uh oh.");
          let slot = getId(`slot-${side}-${col}-${row}`); // may be different from the selected slot!
          ui.currentlyPlaying.fieldPos = {side: side, row: row, column: col}; // put it in its slot
          ui.currentlyPlaying.element.style.bottom = "calc(100% - " + (slot.offsetTop + slot.offsetHeight * 0.75) + "px)";
          ui.currentlyPlaying.element.style.left = slot.offsetLeft + slot.offsetWidth * 0.25 + "px";
          ui.deselect();
        } else {
          let success = ui.currentlyPlaying.summon(row, col);
          if(success) game.endTurn();
        }
      }
    } catch(e) { log("Error: " + e); } }
  } 
  getId("redrawbell").onclick = function() {
    if(game.resolving) return;
    if(game.players.find(x => x.hand.find(y => y.isLeader))) return; // Must play leader
    for(let i of game.players) {
      while(i.hand.length) i.discard(i.hand[0]);
      for(let j = 0; j < 6; j++) i.draw();
    }
    game.crownedPhase = false;
    if(game.redrawBellTime) game.endTurn();
    game.redrawBellTime = 4;
    getId("redrawbell").textContent = "Redraw [4]";
    getId("redrawbell").style.color = "white";
  }
  getId("wavebell").onclick = function() {
    if(game.resolving) return;
    game.callNextWave();
    game.waveBellTime = 4;
    getId("wavebell").textContent = "Wave [4]";
  }
  getId("wavebell").textContent = "Wave [4]";

  log("Running script...");
  const rivu = new Player(0, true);
  let startingDeck = [
    new FoxeeCard(rivu),
    new SneezleCard(rivu),
    new ScrappySwordCard(rivu),
    new ScrappySwordCard(rivu),
    new ScrappySwordCard(rivu),
    new SnowStickCard(rivu),
    new SnowStickCard(rivu),
    new SunRodCard(rivu),
    new FlamewaterCard(rivu),
    new WoodheadCard(rivu),
  ];
  startingDeck[0].isLeader = true;
  startingDeck[0].crowned = true;
  for(let i of startingDeck) i.init();
  const arti = new Player(1, false);
  game.wavesLeft = [
    [new ChungoonCard(arti, false, false), new WildSnoolfCard(arti, false, false), new PengoonCard(arti, false, false)],
    [new WaddlegoonsCard(arti, false, false), new GoblingCard(arti, false, false)],
    [new PengoonCard(arti, false, false), new PengoonCard(arti, false, false), new BigPengCard(arti, false, false), new PengoonCard(arti, false, false), new PengoonCard(arti, false, false)]
  ];
  game.callNextWave();
  game.doCrownedPhase(rivu);
} catch(e) { log("Error in setup: " + e); }