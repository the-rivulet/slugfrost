export function log(text) {
    if (document.getElementById("log").innerHTML.length >= 1000) {
        document.getElementById("log").innerHTML = document.getElementById("log").innerHTML.slice(-1000);
    }
    document.getElementById("log").innerHTML += "<br/>" + text;
    if (text.includes("Error") || text.includes("error"))
        alert("An error occured! Check the logs.");
}
export function getId(id) {
    return document.getElementById(id);
}
export function shuffleArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
class Game {
    constructor() {
        this.players = [];
        this.inCombat = false;
        this.battlefield = [];
        this.crownedPhase = false;
        this.actionStack = [];
        this.actionDelay = 500;
        this.redrawBellTime = 0;
        this.waveBellTime = 4;
        this.wavesLeft = [];
        this.resolving = false;
        this.readyToEnd = false;
        this.mapX = -1;
        this.mapY = 1;
        this.fightsLeft = [];
        this.inDeckView = false;
        this.companionDeck = [];
        this.treasureDeck = [];
        this.firstCombat = true;
    }
    cardsByPos(side, row, col) {
        let cards = this.battlefield;
        if (side != undefined)
            cards = cards.filter(x => x.fieldPos.side == side);
        if (row != undefined)
            cards = cards.filter(x => x.fieldPos.row == row);
        if (col != undefined)
            cards = cards.filter(x => x.fieldPos.column == col);
        return cards.sort((a, b) => a.fieldPos.side * 100 - b.fieldPos.side * 100 + a.fieldPos.column * 10 - b.fieldPos.column * 10 + a.fieldPos.row * -1 - b.fieldPos.row * -1);
    }
    resolveNext() { this.actionStack.pop().execute(); }
    resolveAll() {
        this.resolving = this.actionStack.length > 0;
        if (this.resolving) {
            document.body.classList.add("resolving");
            this.resolveNext();
            setTimeout(() => { this.resolveAll(); }, this.actionDelay);
        }
        else if (!this.waveBellTime) {
            this.waveBellTime = 4;
            this.callNextWave();
        }
        else if (this.readyToEnd) {
            this.readyToEnd = false;
            this.endTurn();
        }
        if (!this.resolving)
            document.body.classList.remove("resolving");
    }
    endTurn(side) {
        try {
            if (this.actionStack.length) {
                this.readyToEnd = true;
                if (!this.resolving)
                    this.resolveAll();
                return;
            }
            if (this.crownedPhase)
                return;
            let cards = (side != undefined ? this.cardsByPos(side) : this.cardsByPos()).filter(x => hasCounter(x));
            for (let i of cards) {
                i.tickDown();
            }
            this.resolveAll();
            this.redrawBellTime = Math.max(0, this.redrawBellTime - 1);
            getId("redrawbell").textContent = "Redraw [" + (this.redrawBellTime || "Charged!") + "]";
            getId("redrawbell").style.color = this.redrawBellTime ? "white" : "var(--theme-color-blings)";
            this.waveBellTime--;
            getId("wavebell").textContent = "Wave [" + this.waveBellTime + "]";
        }
        catch (e) {
            log("Error in endTurn(): " + e);
        }
    }
    callNextWave() {
        try {
            let wave = this.wavesLeft[0];
            if (!wave)
                return;
            this.wavesLeft = this.wavesLeft.slice(1);
            for (let i of wave) {
                let validLanes = [0, 1].filter(x => !this.cardsByPos(i.owner.side, x, 2).length);
                if (validLanes.length) {
                    i.init();
                    i.summon(validLanes[Math.floor(Math.random() * validLanes.length)], 2);
                    this.resolveAll();
                }
                else {
                    if (!this.wavesLeft.length)
                        this.wavesLeft.push([]);
                    this.wavesLeft[0].push(i);
                }
            }
            getId("wavebell").textContent = "Wave [" + this.waveBellTime + "]";
            this.resolveAll();
            if (!this.wavesLeft.length)
                getId("wavebell").style.display = "none";
        }
        catch (e) {
            log("Error in callNextWave(): " + e);
        }
    }
    doCrownedPhase(p) {
        this.crownedPhase = true;
        getId("redrawbell").textContent = "End Crown Phase";
        for (let i = 0; i < p.drawPile.length; i++) {
            let card = p.drawPile[i];
            if (card.crowned) {
                p.drawPile.splice(i, 1);
                p.hand.push(card);
                i--;
            }
        }
        p.updateHand();
    }
    setupMap() {
        if (this.fightsLeft.length < 2) {
            alert("YOU WIN :D");
            log("YOU WIN :D");
            for (let i of Array.from(document.getElementsByClassName("mapitem"))) {
                i.style.display = "none";
            }
            return;
        }
        let randomEvent = () => [
            MapEvent.blingsnailCave,
            MapEvent.frozenTravelers,
            MapEvent.frozenTravelers,
            MapEvent.muncher,
            MapEvent.treasureChest,
            MapEvent.treasureChest
        ][Math.floor(Math.random() * 4)];
        let mapType = Math.random() < 0.5 ? ["1-0", "1-1", "0-2", "2-2", "0-3", "2-3", "1-4", "1-5"] : ["1-0", "0-1", "2-1", "0-2", "2-2", "0-3", "2-3", "1-4"];
        for (let i of Array.from(document.getElementsByClassName("mapitem"))) {
            if (mapType.includes(i.id.replace("map-", ""))) {
                i.style.display = "";
                i.innerHTML = randomEvent().replace("|", "<br/>");
            }
            else
                i.style.display = "none";
        }
        if (mapType.includes("1-5")) {
            getId("map-1-4").innerHTML = MapEvent.woollySnail.replace("|", "<br/>");
            getId("map-1-5").innerHTML = "Fight: " + this.fightsLeft[1].name;
        }
        else {
            getId("map-" + Math.round(Math.random()) * 2 + "-3").innerHTML = MapEvent.woollySnail.replace("|", "<br/>");
            getId("map-1-4").innerHTML = "Fight: " + this.fightsLeft[1].name;
        }
        getId("map-1-0").innerHTML = "Fight: " + this.fightsLeft[0].name;
        for (let i of Array.from(document.getElementsByClassName("mapitem")).filter(x => mapType.includes(x.id.replace("map-", "")))) {
            i.onclick = function (e) {
                try {
                    log("Clicked on: " + i.id);
                    if (Math.abs(parseInt(i.id.split("-")[1]) - game.mapY) >= 2 || parseInt(i.id.split("-")[2]) != 1 + game.mapX)
                        return;
                    game.mapY = parseInt(i.id.split("-")[1]);
                    game.mapX = parseInt(i.id.split("-")[2]);
                    log("Activating node");
                    getId("worldmap").style.top = "-100%";
                    if (i.innerHTML.includes("Fight"))
                        game.startCombat();
                    else if (i.innerHTML.includes(MapEvent.muncher.split("|")[0])) {
                        game.muncherCounter = 2;
                        getId("event-muncher").style.top = "10%";
                    }
                    else if (i.innerHTML.includes(MapEvent.blingsnailCave.split("|")[0])) {
                        getId("event-blingsnailcave").style.top = "10%";
                    }
                    else if (i.innerHTML.includes(MapEvent.frozenTravelers.split("|")[0])) {
                        getId("event-frozentravelers").innerHTML = "Three travelers offer to join you.<br/><br/>(Choose one, or click here to turn them down.)";
                        getId("event-frozentravelers").style.top = "10%";
                        let numTravelers = Math.min(game.companionDeck.length, 3);
                        for (let i = 0; i < numTravelers; i++) {
                            let card = game.companionDeck.splice(Math.floor(Math.random() * game.companionDeck.length), 1)[0];
                            card.createRewardElement("event-frozentravelers", 0, x => "You accept " + x + " as a companion.<br/><br/>(Click to continue.)");
                            card.element.style.left = `calc(50% - 180px * ${i} + 135px * ${numTravelers - 2})`;
                            card.init();
                        }
                    }
                    else if (i.innerHTML.includes(MapEvent.treasureChest.split("|")[0])) {
                        getId("event-treasurechest").innerHTML = "The chest contains three items.<br/><br/>(Choose one, or click here to leave them behind.)";
                        getId("event-treasurechest").style.top = "10%";
                        let numRewards = Math.min(game.treasureDeck.length, 3);
                        for (let i = 0; i < numRewards; i++) {
                            let card = game.treasureDeck.splice(Math.floor(Math.random() * game.treasureDeck.length), 1)[0];
                            card.createRewardElement("event-treasurechest", 0, x => "The chest closes as you remove the " + x + ".<br/><br/>(Click to continue.)");
                            card.element.style.left = `calc(50% - 180px * ${i} + 135px * ${numRewards - 2})`;
                            card.init();
                        }
                    }
                    else if (i.innerHTML.includes(MapEvent.woollySnail.split("|")[0])) {
                        getId("event-woollysnail").style.top = "10%";
                        let consume = () => game.treasureDeck.filter(x => x.abilities.find(x => x.id == `base.consume`));
                        let nonConsume = () => game.treasureDeck.filter(x => !x.abilities.find(x => x.id == `base.consume`));
                        let numConsume = Math.min(consume().length, 1), numNonConsume = Math.min(nonConsume().length, 3), numItems = numConsume + numNonConsume;
                        for (let i = 0; i < numNonConsume; i++) {
                            let moni = Math.round(Math.random() * 20 + 30);
                            let card = game.treasureDeck.splice(game.treasureDeck.indexOf(nonConsume()[Math.floor(Math.random() * nonConsume().length)]), 1)[0];
                            card.createRewardElement("event-woollysnail", moni);
                            card.element.style.left = `calc(50% - 180px * ${i} + 135px * ${numItems - 2})`;
                            card.init();
                            let price = document.createElement("div");
                            price.classList.add("pricetag");
                            price.innerHTML = moni + " Blings";
                            price.style.left = `calc(50% - 180px * ${i} + 135px * ${numItems - 2} + 15px)`;
                            getId("event-woollysnail").appendChild(price);
                        }
                        for (let i = 0; i < numConsume; i++) {
                            let moni = Math.round(Math.random() * 20 + 45);
                            let card = game.treasureDeck.splice(game.treasureDeck.indexOf(consume()[Math.floor(Math.random() * consume().length)]), 1)[0];
                            card.createRewardElement("event-woollysnail", moni);
                            card.element.style.left = `calc(50% - 180px * ${i + numNonConsume} + 135px * ${numItems - 2})`;
                            card.init();
                            let price = document.createElement("div");
                            price.classList.add("pricetag");
                            price.innerHTML = moni + " Blings";
                            price.style.left = `calc(50% - 180px * ${i + numNonConsume} + 135px * ${numItems - 2} + 15px)`;
                            getId("event-woollysnail").appendChild(price);
                        }
                    }
                }
                catch (e) {
                    log("Error in clicking node: " + e);
                }
            };
        }
        this.updateMap();
    }
    updateMap() {
        for (let i of Array.from(document.getElementsByClassName("mapitem"))) {
            if (Math.abs(parseInt(i.id.split("-")[1]) - this.mapY) < 2 && parseInt(i.id.split("-")[2]) == 1 + this.mapX) {
                i.classList.add("curmap");
            }
            else
                i.classList.remove("curmap");
        }
    }
    startCombat() {
        getId("battlefield").style.top = "0%";
        getId("deckview").style.display = "none";
        getId("wavebell").style.display = "";
        if (game.inDeckView) {
            game.inDeckView = false;
            for (let card of game.players[0].deckpack) {
                card.element.style.left = "calc(100% - " + card.element.offsetWidth + "px)";
                card.element.style.bottom = "10px";
                card.element.style.opacity = "0";
            }
            ui.deselect();
        }
        this.inCombat = true;
        for (let p of this.players) {
            while (p.hand.length)
                p.discard(p.hand[0]);
            p.drawPile = p.deckpack.slice(0);
            shuffleArray(p.drawPile);
            for (let i of p.drawPile) {
                i.curEffects = structuredClone(i.baseEffects.slice(0));
                for (let a of i.abilities) {
                    if (hasMagicNumber(a)) {
                        a.magic = a.baseMagic;
                    }
                }
                i.init();
                i.updateElement();
            }
            p.hand = [];
            p.discardPile = [];
            this.doCrownedPhase(p);
        }
        if (this.firstCombat) {
            this.wavesLeft = this.fightsLeft[0].enemies;
        }
        else {
            this.wavesLeft = this.fightsLeft[1].enemies;
            this.fightsLeft = this.fightsLeft.slice(1);
        }
        this.redrawBellTime = 0;
        this.waveBellTime = 4;
        this.callNextWave();
        log("Combat started!");
    }
    endCombat() {
        getId("worldmap").style.top = "0%";
        getId("battlefield").style.top = "-100%";
        getId("deckview").style.display = "";
        getId("wavebell").style.display = "none";
        for (let i of this.battlefield) {
            i.element.style.opacity = "0";
            i.fieldPos = undefined;
        }
        this.battlefield = [];
        this.actionStack = [];
        for (let p of this.players) {
            while (p.hand.length)
                p.discard(p.hand[0]);
            for (let i of p.deckpack) {
                i.curEffects = structuredClone(i.baseEffects.slice(0));
                log("Reset " + i.name + "'s effects -> " + i.curEffects.map(x => x.name) + " (" + i.baseEffects.map(x => x.name) + ")");
                for (let a of i.abilities) {
                    if (hasMagicNumber(a)) {
                        a.magic = a.baseMagic;
                    }
                }
                i.init();
                i.updateElement();
            }
        }
        if (!this.firstCombat) {
            this.mapX = 0;
            this.mapY = 1;
            this.setupMap();
        }
        this.firstCombat = false;
        this.updateMap();
        this.inCombat = false;
        log("Combat ended!");
    }
}
export const game = new Game();
export var MapEvent;
(function (MapEvent) {
    MapEvent["blingsnailCave"] = "Blingsnail Cave|Find some Blings";
    MapEvent["charmDispenser"] = "Charm Dispenser|Get a Charm";
    MapEvent["treasureChest"] = "Treasure Chest|Add 1 of 3 items";
    MapEvent["frozenTravelers"] = "Frozen Travelers|Add 1 of 3 companions";
    MapEvent["muncher"] = "Muncher|Remove up to 2 cards";
    MapEvent["woollySnail"] = "The Woolly Snail|Buy things with Blings";
})(MapEvent || (MapEvent = {}));
export class Player {
    get blings() { return this._blings; }
    set blings(amt) {
        this._blings = amt;
        let curAmt = parseInt(getId("blings").textContent.split(" ")[0]);
        let changeBling = () => {
            if (curAmt < this._blings)
                curAmt++;
            else if (curAmt > this._blings)
                curAmt--;
            else
                return;
            getId("blings").textContent = curAmt + " Blings";
            setTimeout(() => changeBling(), 25);
        };
        changeBling();
    }
    constructor(side, realPlayer) {
        this.deckpack = [];
        this.hand = [];
        this.drawPile = [];
        this.discardPile = [];
        this.exilePile = [];
        this._blings = 0;
        this.side = side;
        if (realPlayer)
            game.players.push(this);
    }
    updateHand() {
        for (let i of this.hand) {
            i.element.style.opacity = "1";
            i.element.style.left = `calc(50% - 110px * ${this.hand.indexOf(i)} + 55px * ${this.hand.length - 2})`;
            i.element.style.bottom = "";
        }
    }
    discard(card) {
        if (this.hand.includes(card))
            this.hand.splice(this.hand.indexOf(card), 1);
        else
            return;
        this.discardPile.push(card);
        card.element.style.left = "calc(100% - " + card.element.offsetWidth + "px)";
        card.element.style.opacity = "0";
        this.updateHand();
    }
    exile(card) {
        if (this.hand.includes(card))
            this.hand.splice(this.hand.indexOf(card), 1);
        this.exilePile.push(card);
        card.element.style.left = "calc(100% - " + card.element.offsetWidth + "px)";
        card.element.style.opacity = "0";
        this.updateHand();
    }
    draw() {
        if (!this.drawPile.length) {
            if (!this.discardPile.length)
                return false;
            this.drawPile = this.discardPile.slice(0);
            shuffleArray(this.drawPile);
            this.discardPile = [];
        }
        this.hand.push(this.drawPile.pop());
        this.updateHand();
        return true;
    }
}
export function hasAttack(x) {
    return "baseAttack" in x && typeof x.baseAttack == "number";
}
export function hasCounter(x) {
    return "baseCounter" in x && typeof x.baseCounter == "number";
}
export function hasCondition(x) {
    return "condition" in x && typeof x.condition == "function";
}
export function hasMagicNumber(ability) {
    return "baseMagic" in ability && typeof ability.baseMagic == "number";
}
export var Side;
(function (Side) {
    Side["left"] = "left";
    Side["right"] = "right";
})(Side || (Side = {}));
export const ui = {
    currentlyPlaying: undefined,
    deselect: () => {
        var _a;
        (_a = ui.currentlyPlaying) === null || _a === void 0 ? void 0 : _a.element.classList.remove("currentlyPlaying");
        ui.currentlyPlaying = undefined;
    }
};
export let tcount = 0;
export let themeColors = [
    {
        name: "Rivulet",
        bgcolors: ["#55a", "#226", "#a0a", "black", "#111", "#333", "#666", "white"],
        uicolors: ["salmon", "#733", "skyblue", "gold", "red", "orange", "gray"],
    }, {
        name: "Artificer",
        bgcolors: ["#a55", "#622", "#668", "black", "#311", "#533", "#866", "#fdd"],
        uicolors: ["salmon", "#733", "skyblue", "gold", "red", "orange", "#a88"],
    }, {
        name: "Saint",
        bgcolors: ["#5a5", "#262", "#335", "black", "#001", "#223", "#446", "white"],
        uicolors: ["salmon", "#733", "skyblue", "gold", "red", "orange", "#696"],
    }, {
        name: "Nightcat",
        bgcolors: ["#666", "#222", "#222", "black", "#111", "#333", "#666", "white"],
        uicolors: ["#aaa", "#aaa", "#aaa", "#aaa", "white", "#aaa", "gray"],
    }
];
export function applyTheme(theme) {
    tcount = theme;
    let t = themeColors[theme].bgcolors;
    document.body.style.cssText = t.map((x, i) => "--theme-color-" + i + ": " + x + ";").join(" ") + " --theme-color-blings: " + themeColors[theme].uicolors[3] + ";";
}
