import { game, getId, Player, ui, log, shuffleArray, applyTheme, themeColors } from "./game.js";
import { BamboozleCard, BerryBasketCard, BerryBladeCard, BigBerryCard, BigPengCard, BijiCard, BiteboxCard, BlazeTeaCard, BlizzardBottleCard, BonnieCard, ChungoonCard, DragonPepperCard, FirefistCard, FlamewaterCard, FoxeeCard, FrostBellCard, FrostbloomCard, FrostingerCard, GachapomperCard, GoblingCard, GogongCard, GojiberCard, HeartmistStationCard, IceLanternCard, MimikCard, MoltenDipCard, NakedGnomeCard, PengoonCard, PeppereaperCard, PepperingCard, PinkberryJuiceCard, PorkypineCard, PyraCard, ScrappySwordCard, SlapcrackersCard, SneezleCard, SnobbleCard, SnowboCard, SnowcakeCard, SnowStickCard, StormbearSpiritCard, SunlightDrumCard, SunRodCard, TheRingerCard, WaddlegoonsCard, WildSnoolfCard, WinterWormCard, WoodheadCard } from "./slugfrost/cards.js";
import { ClunkerCard, CompanionCard, ItemCard, UnitCard } from "./card.js";

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
  getId("redrawbell").onclick = function() { try {
    if(game.resolving) return;
    if(game.players.find(x => x.hand.find(y => y.leader))) { log(game.players.map(x => x.side + " : [" + x.hand.map(x => x.name + "=" + x.leader) + "]")); return; } // Must play leader
    for(let i of game.players) {
      while(i.hand.length) i.discard(i.hand[0]);
      for(let j = 0; j < 6; j++) i.draw();
    }
    game.crownedPhase = false;
    if(game.redrawBellTime) game.endTurn();
    game.redrawBellTime = 4;
    getId("redrawbell").textContent = "Redraw [4]";
    getId("redrawbell").style.color = "white";
  } catch(e) { log("Error in redraw bell: " + e); } }
  getId("wavebell").onclick = function() { try {
    if(game.resolving) return;
    game.waveBellTime = 4;
    game.callNextWave();
  } catch(e) { log("Error in wave bell: " + e); } }
  getId("wavebell").textContent = "Wave [4]";
  function deckView(rowSize = 7) { try {
    for(let offset = 0; offset < rivu.deckpack.length; offset += rowSize) {
      let row = rivu.deckpack.slice(offset, offset + rowSize);
      for(let card of row) {
        let i = row.indexOf(card);
        card.element.style.left = `calc(50% - 110px * ${i} + 55px * ${row.length - 2})`;
        card.element.style.bottom = 10 + offset * (150/rowSize) + "px";
        card.element.style.opacity = "1";
        card.element.style.display = "";
      }
    }
  } catch(e) { log("Error in deck view: " + e); } }
  getId("event-muncher").onclick = function() {
    if(game.muncherCounter <= 0) return;
    if(ui.currentlyPlaying instanceof ItemCard || ui.currentlyPlaying instanceof ClunkerCard) {
      // Remove the card from your deck permanently
      let i = ui.currentlyPlaying.owner.deckpack.indexOf(ui.currentlyPlaying);
      ui.currentlyPlaying.owner.deckpack.splice(i, 1);
      ui.currentlyPlaying.element.remove(); // and erase it from the DOM
      if(game.inDeckView) deckView();
      ui.deselect();
      game.muncherCounter--;
      if(!game.muncherCounter) {
        getId("worldmap").style.top = "0%";
        getId("event-muncher").style.top = "-100%";
        game.updateMap();
      }
    } else if(!ui.currentlyPlaying) {
      getId("worldmap").style.top = "0%";
      getId("event-muncher").style.top = "-100%";
      game.updateMap();
    }
  }
  getId("event-blingsnailcave").onclick = function() {
    game.players[0].blings += Math.floor(Math.random() * 40 + 40);
    getId("worldmap").style.top = "0%";
    getId("event-blingsnailcave").style.top = "-100%";
    game.updateMap();
  }
  getId("event-frozentravelers").onclick = function() {
    for(let i of Array.from(getId("event-frozentravelers").children)) i.remove();
    getId("worldmap").style.top = "0%";
    getId("event-frozentravelers").style.top = "-100%";
    if(game.inDeckView) deckView();
    game.updateMap();
  }
  getId("event-treasurechest").onclick = function() {
    for(let i of Array.from(getId("event-treasurechest").children)) i.remove();
    getId("worldmap").style.top = "0%";
    getId("event-treasurechest").style.top = "-100%";
    if(game.inDeckView) deckView();
    game.updateMap();
  }
  getId("event-woollysnail").onclick = function() {
    for(let i of Array.from(getId("event-woollysnail").children)) i.remove();
    getId("worldmap").style.top = "0%";
    getId("event-woollysnail").style.top = "-100%";
    if(game.inDeckView) deckView();
    game.updateMap();
  }
  getId("deckview").onclick = function() {
    if(game.inDeckView) {
      game.inDeckView = false;
      for(let card of rivu.deckpack) {
        card.element.style.left = "calc(100% - " + card.element.offsetWidth + "px)";
        card.element.style.bottom = "10px";
        card.element.style.opacity = "0";
      }
      ui.deselect();
    } else {
      game.inDeckView = true;
      deckView();
    }
  }

  let tcount = 0;
  log("Applying");
  applyTheme(0);

  document.onkeydown = function(e) {
    if(e.repeat) return;
    if(e.key == "Tab") {
      e.preventDefault();
      if(getId("log").style.opacity == "0") getId("log").style.opacity = "";
      else getId("log").style.opacity = "0";
    } else if(e.key == "f") {
      if(game.actionDelay == 500) game.actionDelay = 100;
      else game.actionDelay = 100;
      log("Set action delay to " + game.actionDelay);
    } else if(e.key == "r") {
      for(let i of game.battlefield) i.updateElement();
    } else if(e.key == "t") {
      if(tcount + 1 == themeColors.length) tcount = 0;
      else tcount++;
      applyTheme(tcount);
    }
  }
  document.onmousemove = function(e) {
    getId("tip").style.left = e.clientX + 20 + "px";
    getId("tip").style.top = e.clientY + 20 + "px";
  }

  log("Running script...");
  const rivu = new Player(0, true);
  const foxi = new FoxeeCard(rivu);
  foxi.leader = true;
  foxi.crowned = true;
  let startingDeck = [
    foxi,
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
  for(let i of startingDeck) i.init();
  const arti = new Player(1, false);
  game.fightsLeft = [
    //{name: "Gnome!", enemies: [[new NakedGnomeCard(arti, false)]]},
    {name: "The Pengoons", enemies: [
      [new ChungoonCard(arti, false), new WildSnoolfCard(arti, false), new PengoonCard(arti, false)],
      [new WaddlegoonsCard(arti, false), new GoblingCard(arti, false)],
      [new PengoonCard(arti, false), new PengoonCard(arti, false), new BigPengCard(arti, false), new PengoonCard(arti, false), new PengoonCard(arti, false)]
    ]},
    {name: "The Frost Shades", enemies: [
      [new FrostingerCard(arti, false), new PorkypineCard(arti, false), new MimikCard(arti, false)],
      [new FrostingerCard(arti, false), new GoblingCard(arti, false), new MimikCard(arti, false), new IceLanternCard(arti, false)],
      [new TheRingerCard(arti, false), new FrostingerCard(arti, false), new PorkypineCard(arti, false)]
    ]},
    {name: "Bamboozle", enemies: [
      [new BamboozleCard(arti, false), new WinterWormCard(arti, false), new SnowboCard(arti, false)],
      [new WinterWormCard(arti, false), new SnowboCard(arti, false)],
      [new SnowboCard(arti, false), new SnowboCard(arti, false)]
    ]},
  ];
  game.companionDeck = [
    new BijiCard(rivu, false),
    new BigBerryCard(rivu, false),
    new BonnieCard(rivu, false),
    new GojiberCard(rivu, false),
    new FirefistCard(rivu, false),
    new PyraCard(rivu, false),
    new SnobbleCard(rivu, false)
  ];
  game.treasureDeck = [
    new BlazeTeaCard(rivu, false),
    new BerryBasketCard(rivu, false),
    new BerryBladeCard(rivu, false),
    new BlizzardBottleCard(rivu, false),
    new FrostBellCard(rivu, false),
    new FrostbloomCard(rivu, false),
    new MoltenDipCard(rivu, false),
    new SlapcrackersCard(rivu, false),
    new PinkberryJuiceCard(rivu, false),
    new SunlightDrumCard(rivu, false),
    new StormbearSpiritCard(rivu, false),
    new PeppereaperCard(rivu, false),
    new PepperingCard(rivu, false),
    new DragonPepperCard(rivu, false),
    new SnowcakeCard(rivu, false),
    new MimikCard(rivu, false),
    new BiteboxCard(rivu, false),
    new GachapomperCard(rivu, false),
    new HeartmistStationCard(rivu, false)
  ];
  game.setupMap();
} catch(e) { log("Error in setup: " + e); }