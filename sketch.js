// ==========================================
// 今夜のおでん:鍋を囲む
// 共有鍋・待ち受けドラフトの試作版
// Codea Lite / 完全差し替え用
// ==========================================

const GAME_W = 180;
const GAME_H = 320;
const POT_SIZE = 5;
const TURNS_PER_NIGHT = 4;

const STATE = {
  TITLE: "TITLE",
  INTRO: "INTRO",
  PLAYER_TURN: "PLAYER_TURN",
  RIVALS_TURN: "RIVALS_TURN",
  RESULT: "RESULT"
};

const PALETTE = {
  " ": null,
  "W": { r: 240, g: 240, b: 240 }, "w": { r: 200, g: 200, b: 200 },
  "Y": { r: 240, g: 200, b: 80 }, "y": { r: 200, g: 160, b: 60 },
  "B": { r: 140, g: 80, b: 50 }, "b": { r: 100, g: 50, b: 30 },
  "G": { r: 120, g: 130, b: 130 }, "g": { r: 90, g: 100, b: 100 },
  "O": { r: 220, g: 150, b: 80 }, "o": { r: 180, g: 110, b: 50 },
  "L": { r: 250, g: 230, b: 180 }, "l": { r: 220, g: 190, b: 140 },
  "C": { r: 230, g: 180, b: 100 }, "c": { r: 120, g: 70, b: 40 },
  "S": { r: 200, g: 220, b: 220 }, "s": { r: 160, g: 180, b: 180 },
  "D": { r: 40, g: 40, b: 50 }, "d": { r: 20, g: 20, b: 30 }
};

const ART = {
  daikon: [" WWWW ", "WWWWWW", "WWWWWW", " wwww ", " wwww ", "  ww  "],
  egg: ["  YY  ", " YYYY ", "YYYYYY", "yyyyyy", " yyyy ", "  yy  "],
  beef: ["  b   ", " bBb  ", " bBbb ", "bbBBbb", "  b   ", "  b   "],
  konnyaku: ["  GG  ", " GGGG ", "GGGGGG", "gggggg", " gggg ", "  gg  "],
  ganmo: [" OOOO ", "OOOOOO", "oOOOOo", "oooooo", " oooo ", "  oo  "],
  mochi: ["  ll  ", " LLLL ", "LLLLLL", "llllll", " llll ", "  ll  "],
  chikuwa: [" CCcc ", "CCCCCC", "CCCCCC", "cccccc", " cccc ", "  cc  "],
  shirataki: ["  SS  ", " SSSS ", "sSSsSS", "ssssss", " ssss ", "  ss  "]
};

// 数字は一切使わない。具には「軽い・しみる・重い」の役割だけがある。
const KIND = {
  LIGHT: "LIGHT",
  SOAK: "SOAK",
  RICH: "RICH"
};

const DISHES = [
  { id: "SHIRATAKI", name: "しらたき", visual: "shirataki", kind: KIND.LIGHT, volume: 1 },
  { id: "KONNYAKU", name: "こんにゃく", visual: "konnyaku", kind: KIND.LIGHT, volume: 1 },
  { id: "CHIKUWA", name: "ちくわ", visual: "chikuwa", kind: KIND.LIGHT, volume: 1 },
  { id: "EGG", name: "たまご", visual: "egg", kind: KIND.SOAK, volume: 2 },
  { id: "DAIKON", name: "だいこん", visual: "daikon", kind: KIND.SOAK, volume: 2 },
  { id: "GANMODOKI", name: "がんも", visual: "ganmo", kind: KIND.SOAK, volume: 2 },
  { id: "MOCHI_POUCH", name: "餅巾着", visual: "mochi", kind: KIND.RICH, volume: 3 },
  { id: "BEEF_TENDON", name: "牛すじ", visual: "beef", kind: KIND.RICH, volume: 3 }
];

const LEFT_RIVAL = {
  name: "常連さん",
  coat: { r: 80, g: 61, b: 48 },
  hair: { r: 47, g: 40, b: 36 },
  preference: KIND.SOAK
};

const RIGHT_RIVAL = {
  name: "学生さん",
  coat: { r: 64, g: 80, b: 108 },
  hair: { r: 35, g: 35, b: 40 },
  preference: KIND.LIGHT
};

let scaleFactor = 1;
let offsetX = 0;
let offsetY = 0;
let inputLockTimer = 0;
let model;

class GameModel {
  constructor() {
    this.reset();
  }

  reset() {
    this.state = STATE.TITLE;
    this.deck = [];
    this.pot = [];
    this.playerBowl = [];
    this.leftBowl = [];
    this.rightBowl = [];
    this.turn = 0;
    this.rivalPhase = 0;
    this.rivalTimer = 0;
    this.stateT = 0;
    this.message = "";
    this.lastTaken = null;
    this.lastTakenBy = "";
    this.playerWaited = false;
    this.resultTitle = "";
    this.resultLine = "";
  }

  makeDeck() {
    const deck = [];

    // どの夜にも三つの役割が混ざる。ただし出てくる順番は毎回違う。
    for (let i = 0; i < 3; i++) {
      for (const dish of DISHES) {
        deck.push({ ...dish, simmer: 0 });
      }
    }

    return deck.sort(() => Math.random() - 0.5);
  }

  drawDish() {
    if (this.deck.length === 0) return null;
    return this.deck.pop();
  }

  refillPot() {
    while (this.pot.length < POT_SIZE) {
      const dish = this.drawDish();
      if (!dish) break;
      this.pot.push(dish);
    }
  }

  startNight() {
    this.reset();
    this.deck = this.makeDeck();
    this.refillPot();
    this.state = STATE.INTRO;
    this.stateT = 0;
    this.message = "同じ鍋を、三人で囲んでいる。\n取りたい具は、今しかないかもしれない。";
  }

  startPlayerTurn() {
    this.playerWaited = false;
    this.state = STATE.PLAYER_TURN;
    this.stateT = 0;
    this.message = "鍋から一つ取る。\n待てば、残った具はもう少し染みる。";
  }

  takePotDish(index, who) {
    if (index < 0 || index >= this.pot.length) return null;

    const dish = this.pot.splice(index, 1)[0];

    if (who === "PLAYER") {
      this.playerBowl.push(dish);
    } else if (who === "LEFT") {
      this.leftBowl.push(dish);
    } else {
      this.rightBowl.push(dish);
    }

    this.lastTaken = dish;
    this.lastTakenBy = who;

    return dish;
  }

  playerTake(index) {
    const dish = this.takePotDish(index, "PLAYER");
    if (!dish) return;

    this.message = `${dish.name}を、自分の椀へ。\n隣の二人も、鍋を見ている。`;
    this.beginRivalsTurn();
  }

  playerWait() {
    this.playerWaited = true;
    this.lastTaken = null;
    this.lastTakenBy = "";
    this.message = "箸を置いて、少し待つ。\n残った具が、だしを吸っていく。";
    this.beginRivalsTurn();
  }

  beginRivalsTurn() {
    this.state = STATE.RIVALS_TURN;
    this.rivalPhase = 0;
    this.rivalTimer = 0;
    this.stateT = 0;
  }

  chooseRivalDish(rival) {
    if (this.pot.length === 0) return -1;

    let bestIndex = 0;
    let bestScore = -999;

    for (let i = 0; i < this.pot.length; i++) {
      const dish = this.pot[i];
      let score = Math.random() * 4;

      // 好みは固定の正解ではない。ただし、それぞれ少し行動の癖がある。
      if (dish.kind === rival.preference) score += 7;

      // よく染みた具は、誰にとっても少し魅力的。
      score += dish.simmer * 4;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    return bestIndex;
  }

  resolveRivalStep() {
    if (this.rivalPhase === 0) {
      const index = this.chooseRivalDish(LEFT_RIVAL);
      const dish = this.takePotDish(index, "LEFT");

      if (dish) {
        this.message = `${LEFT_RIVAL.name}は、${dish.name}を取った。`;
      }

      this.rivalPhase = 1;
      return;
    }

    if (this.rivalPhase === 1) {
      const index = this.chooseRivalDish(RIGHT_RIVAL);
      const dish = this.takePotDish(index, "RIGHT");

      if (dish) {
        this.message = `${RIGHT_RIVAL.name}は、${dish.name}を取った。`;
      }

      this.rivalPhase = 2;
      return;
    }

    this.finishTableTurn();
  }

  finishTableTurn() {
    // 誰にも取られなかった具だけが、少しずつ染みる。
    for (const dish of this.pot) {
      dish.simmer = Math.min(2, dish.simmer + 1);
    }

    this.refillPot();
    this.turn += 1;

    if (this.turn >= TURNS_PER_NIGHT) {
      this.finishNight();
      return;
    }

    this.startPlayerTurn();
  }

  getKindsInPlayerBowl() {
    const kinds = {};

    for (const dish of this.playerBowl) {
      kinds[dish.kind] = true;
    }

    return kinds;
  }

  finishNight() {
    const kinds = this.getKindsInPlayerBowl();
    const hasLight = !!kinds[KIND.LIGHT];
    const hasSoak = !!kinds[KIND.SOAK];
    const hasRich = !!kinds[KIND.RICH];
    const maxSimmer = this.playerBowl.reduce((max, dish) => {
      return Math.max(max, dish.simmer);
    }, 0);

    if (this.playerBowl.length === 0) {
      this.resultTitle = "空いた椀。";
      this.resultLine = "今夜は、鍋の景色だけを\n眺めて帰ることにした。";
    } else if (hasLight && hasSoak && hasRich && maxSimmer >= 2) {
      this.resultTitle = "今夜の、ひと椀。";
      this.resultLine = "軽さも、しみ方も、満足もある。\n待った時間まで、椀に入っている。";
    } else if (hasLight && hasSoak && hasRich) {
      this.resultTitle = "よくまとまった椀。";
      this.resultLine = "鍋を囲んだ四巡りが、\nちょうど一つの夜になった。";
    } else if (maxSimmer >= 2) {
      this.resultTitle = "しみた椀。";
      this.resultLine = "誰かに取られず残った具が、\n静かに主役になった。";
    } else if (this.playerBowl.length < 3) {
      this.resultTitle = "少し軽い椀。";
      this.resultLine = "待っている間に、\n隣の二人が先に箸を伸ばした。";
    } else {
      this.resultTitle = "今夜の椀。";
      this.resultLine = "鍋の中から選んだものだけで、\nちゃんと夜はできている。";
    }

    this.state = STATE.RESULT;
    this.stateT = 0;
  }
}

// ==========================================
// Codea Lite hooks
// ==========================================
function setup() {
  model = new GameModel();
  resized();
}

function resized() {
  const scaleX = WIDTH / GAME_W;
  const scaleY = HEIGHT / GAME_H;
  scaleFactor = Math.min(scaleX, scaleY);
  offsetX = (WIDTH - GAME_W * scaleFactor) / 2;
  offsetY = (HEIGHT - GAME_H * scaleFactor) / 2;
}

function touched(touch) {
  if (ElapsedTime < inputLockTimer) return;
  if (touch.state !== ENDED) return;

  const x = (touch.x - offsetX) / scaleFactor;
  const y = (touch.y - offsetY) / scaleFactor;

  if (x < 0 || x > GAME_W || y < 0 || y > GAME_H) return;
  handleTap(x, y);
}

function lockInput() {
  inputLockTimer = ElapsedTime + 0.24;
}

function isInside(x, y, rx, ry, rw, rh) {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

function getPotSlotRect(index) {
  const positions = [
    { x: 14, y: 205 },
    { x: 65, y: 205 },
    { x: 116, y: 205 },
    { x: 39, y: 176 },
    { x: 91, y: 176 }
  ];

  const p = positions[index] || positions[0];
  return { x: p.x, y: p.y, w: 48, h: 26 };
}

function getWaitRect() {
  return { x: 42, y: 13, w: 96, h: 25 };
}

function getRetryRect() {
  return { x: 33, y: 34, w: 114, h: 28 };
}

function handleTap(x, y) {
  if (model.state === STATE.TITLE) {
    model.startNight();
    lockInput();
    return;
  }

  if (model.state === STATE.PLAYER_TURN) {
    for (let i = 0; i < model.pot.length; i++) {
      const slot = getPotSlotRect(i);
      if (isInside(x, y, slot.x, slot.y, slot.w, slot.h)) {
        model.playerTake(i);
        lockInput();
        return;
      }
    }

    const wait = getWaitRect();
    if (isInside(x, y, wait.x, wait.y, wait.w, wait.h)) {
      model.playerWait();
      lockInput();
    }

    return;
  }

  if (model.state === STATE.RESULT) {
    const retry = getRetryRect();
    if (isInside(x, y, retry.x, retry.y, retry.w, retry.h)) {
      model.startNight();
      lockInput();
    }
  }
}

// ==========================================
// Main draw
// ==========================================
function draw() {
  background(12, 15, 23);

  pushMatrix();
  translate(offsetX, offsetY);
  scale(scaleFactor, scaleFactor);
  pushClip(0, 0, GAME_W, GAME_H);

  updateState();

  if (model.state === STATE.TITLE) {
    drawTitle();
  } else {
    drawBackground();
    drawRivals();
    drawCounter();
    drawPot();
    drawPlayerBowl();
    drawHeader();
    drawMessage();
    drawControls();

    if (model.state === STATE.RESULT) {
      drawResult();
    }
  }

  popClip();
  popMatrix();
}

function updateState() {
  model.stateT += DeltaTime;

  if (model.state === STATE.INTRO && model.stateT > 1.05) {
    model.startPlayerTurn();
  }

  if (model.state === STATE.RIVALS_TURN) {
    model.rivalTimer += DeltaTime;

    if (model.rivalTimer > 0.72) {
      model.rivalTimer = 0;
      model.resolveRivalStep();
    }
  }
}

// ==========================================
// Drawing helpers
// ==========================================
function drawPixelArt(px, py, data, size) {
  if (!data) return;
  noStroke();

  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      const colorData = PALETTE[data[r][c]];
      if (!colorData) continue;

      fill(colorData.r, colorData.g, colorData.b);
      rect(px + c * size, py + (data.length - 1 - r) * size, size, size);
    }
  }
}

function drawSplitText(textValue, x, y, maxLen, lineH) {
  const lines = [];
  const rawLines = String(textValue || "").split("\n");

  for (const raw of rawLines) {
    let lineValue = "";

    for (let i = 0; i < raw.length; i++) {
      lineValue += raw[i];
      if (lineValue.length >= maxLen) {
        lines.push(lineValue);
        lineValue = "";
      }
    }

    if (lineValue.length > 0) lines.push(lineValue);
  }

  textAlign("left");
  for (let i = lines.length - 1; i >= 0; i--) {
    text(lines[i], x, y + (lines.length - 1 - i) * lineH);
  }
}

function getKindLabel(kind) {
  if (kind === KIND.SOAK) return "染";
  if (kind === KIND.RICH) return "重";
  return "軽";
}

function getKindColor(kind) {
  if (kind === KIND.SOAK) return { r: 129, g: 83, b: 54 };
  if (kind === KIND.RICH) return { r: 121, g: 57, b: 48 };
  return { r: 72, g: 91, b: 103 };
}

function drawSimmerMark(x, y, simmer, compact) {
  if (simmer <= 0) return;

  const count = compact ? simmer : simmer + 1;
  for (let i = 0; i < count; i++) {
    const wave = Math.sin(ElapsedTime * 3 + i) * 1;
    fill(255, 236, 183, 130 + simmer * 38);
    rect(x + i * 4 + wave, y, 2, compact ? 3 : 5);
  }
}

function drawBowlDish(dish, index, x, y, isPlayer) {
  const positions = [
    { x: 16, y: 7 }, { x: 51, y: 7 }, { x: 35, y: 16 }, { x: 67, y: 18 }
  ];
  const p = positions[Math.min(index, positions.length - 1)];
  const size = dish.volume >= 3 ? 2 : 1.7;
  const pulse = model.lastTaken === dish && model.lastTakenBy === "PLAYER" && isPlayer
    ? Math.sin(ElapsedTime * 18) * 1.4
    : 0;

  drawPixelArt(x + p.x, y + p.y + pulse, ART[dish.visual], size);

  if (dish.simmer >= 2) {
    fill(255, 224, 155, 42);
    rect(x + p.x - 2, y + p.y - 2, 18, 13);
  }
}

// ==========================================
// Scene
// ==========================================
function drawBackground() {
  rectMode(CORNER);
  noStroke();

  fill(16, 20, 31);
  rect(0, 0, GAME_W, GAME_H);

  fill(29, 35, 48);
  rect(0, 178, GAME_W, 114);

  fill(39, 44, 57);
  rect(0, 187, 22, 70);
  rect(27, 187, 33, 86);
  rect(66, 187, 23, 65);
  rect(95, 187, 38, 84);
  rect(139, 187, 22, 64);
  rect(165, 187, 15, 90);

  const glow = 120 + Math.sin(ElapsedTime * 1.4) * 10;
  fill(228, 181, 94, glow);
  rect(10, 214, 6, 11);
  rect(39, 234, 7, 10);
  rect(72, 207, 6, 12);
  rect(108, 226, 7, 10);
  rect(149, 215, 6, 12);
  rect(169, 235, 5, 10);

  fill(22, 26, 37);
  rect(0, 0, GAME_W, 180);

  stroke(122, 139, 157, 35);
  strokeWidth(1);
  for (let i = 0; i < 12; i++) {
    const x = 7 + i * 16;
    const y = 48 + ((i * 29) % 105);
    line(x, y, x + 8, y + 2);
  }
  noStroke();
}

function drawRivalPerson(x, rival, bowl, side) {
  rectMode(CORNER);
  noStroke();

  const isTaking =
    (side === "LEFT" && model.lastTakenBy === "LEFT") ||
    (side === "RIGHT" && model.lastTakenBy === "RIGHT");
  const bob = isTaking ? Math.sin(ElapsedTime * 18) * 1.5 : 0;

  fill(10, 13, 19, 90);
  rect(x - 14, 244, 28, 4);

  fill(rival.coat.r, rival.coat.g, rival.coat.b);
  rect(x - 12, 247 + bob, 24, 29);

  fill(231, 195, 164);
  rect(x - 8, 278 + bob, 16, 17);

  fill(rival.hair.r, rival.hair.g, rival.hair.b);
  rect(x - 9, 292 + bob, 18, 6);
  rect(x - 9, 285 + bob, 4, 8);

  fill(34, 31, 30);
  rect(x - 4, 285 + bob, 2, 2);
  rect(x + 3, 285 + bob, 2, 2);

  // 小さな椀。ほかの客が実際に鍋を削っていることを見せる。
  fill(61, 39, 34);
  rect(x - 13, 235, 26, 8);
  fill(184, 127, 66);
  rect(x - 10, 238, 20, 3);

  for (let i = 0; i < bowl.length && i < 3; i++) {
    drawPixelArt(x - 9 + i * 6, 241, ART[bowl[i].visual], 0.8);
  }

  fill(229, 218, 193);
  textSize(6);
  textAlign("center");
  text(rival.name, x, 304);
}

function drawRivals() {
  drawRivalPerson(25, LEFT_RIVAL, model.leftBowl, "LEFT");
  drawRivalPerson(155, RIGHT_RIVAL, model.rightBowl, "RIGHT");
}

function drawCounter() {
  rectMode(CORNER);
  noStroke();

  fill(73, 48, 39);
  rect(0, 145, GAME_W, 33);

  fill(113, 72, 50);
  rect(0, 171, GAME_W, 7);

  fill(60, 40, 35);
  rect(0, 141, GAME_W, 5);

  fill(168, 113, 65, 36);
  rect(0, 164, GAME_W, 2);

  fill(199, 193, 173);
  rect(145, 151, 17, 8);
  fill(235, 230, 214);
  rect(147, 153, 13, 5);

  fill(54, 62, 67);
  rect(17, 149, 15, 17);
  fill(115, 125, 128);
  rect(19, 151, 11, 13);
}

function drawPot() {
  rectMode(CORNER);
  noStroke();

  fill(52, 57, 63);
  rect(8, 173, 164, 69);
  fill(104, 109, 114);
  rect(11, 176, 158, 63);
  fill(43, 45, 49);
  rect(15, 179, 150, 56);
  fill(198, 142, 67);
  rect(18, 182, 144, 49);

  // 具が残るほど、鍋の中に小さな湯気が増える。
  const steam = 3 + model.pot.reduce((total, dish) => total + dish.simmer, 0);
  for (let i = 0; i < steam; i++) {
    const sx = 27 + ((i * 19) % 125) + Math.sin(ElapsedTime * 1.6 + i) * 2;
    const sy = 225 + (i % 2) * 3;
    fill(250, 239, 211, 22 + (i % 3) * 11);
    rect(sx, sy, 4, 8 + (i % 2) * 4);
  }

  for (let i = 0; i < model.pot.length; i++) {
    const dish = model.pot[i];
    const slot = getPotSlotRect(i);
    const selected = model.state === STATE.PLAYER_TURN;
    const kindColor = getKindColor(dish.kind);

    fill(75, 59, 47);
    rect(slot.x - 1, slot.y - 1, slot.w + 2, slot.h + 2);
    fill(230, 177, 89);
    rect(slot.x, slot.y, slot.w, slot.h);
    fill(255, 225, 158, 28);
    rect(slot.x + 2, slot.y + 2, slot.w - 4, slot.h - 4);

    if (selected) {
      fill(255, 243, 213, 32 + Math.sin(ElapsedTime * 4 + i) * 15);
      rect(slot.x + 1, slot.y + 1, slot.w - 2, slot.h - 2);
    }

    drawPixelArt(slot.x + 4, slot.y + 9, ART[dish.visual], 1.3);

    fill(71, 49, 37);
    textSize(5);
    textAlign("left");
    text(dish.name, slot.x + 17, slot.y + 13);

    fill(kindColor.r, kindColor.g, kindColor.b);
    rect(slot.x + 18, slot.y + 4, 8, 5);
    fill(255, 244, 220);
    textSize(5);
    textAlign("center");
    text(getKindLabel(dish.kind), slot.x + 22, slot.y + 5);

    drawSimmerMark(slot.x + 31, slot.y + 4, dish.simmer, true);
  }

  fill(238, 224, 195);
  textSize(7);
  textAlign("left");
  text("みんなの鍋", 15, 247);

  fill(108, 78, 54);
  textSize(6);
  textAlign("right");
  text("軽 染 重", 165, 247);
}

function drawPlayerBowl() {
  rectMode(CORNER);
  noStroke();

  const x = 38;
  const y = 63;

  fill(8, 10, 14, 105);
  rect(x + 11, y - 5, 96, 5);

  fill(76, 45, 38);
  rect(x, y, 106, 50);
  fill(117, 67, 48);
  rect(x + 4, y + 4, 98, 42);
  fill(224, 208, 176);
  rect(x + 9, y + 36, 88, 6);
  fill(83, 51, 38);
  rect(x + 12, y + 9, 82, 29);
  fill(182, 125, 62);
  rect(x + 15, y + 13, 76, 21);

  for (let i = 0; i < model.playerBowl.length; i++) {
    drawBowlDish(model.playerBowl[i], i, x, y, true);
  }

  if (model.playerBowl.length === 0) {
    fill(240, 221, 182, 130);
    textSize(7);
    textAlign("center");
    text("まだ、空いている", GAME_W / 2, 82);
  }

  fill(228, 216, 191);
  textSize(7);
  textAlign("left");
  text("あなたのお椀", 40, 121);

  // 数字を出さず、役割の揃い方だけを小さな札で見せる。
  const kinds = model.getKindsInPlayerBowl();
  const labels = [KIND.LIGHT, KIND.SOAK, KIND.RICH];
  for (let i = 0; i < labels.length; i++) {
    const kind = labels[i];
    const color = getKindColor(kind);
    fill(kinds[kind] ? color.r : 83, kinds[kind] ? color.g : 78, kinds[kind] ? color.b : 68);
    rect(110 + i * 13, 117, 10, 7);
    fill(244, 237, 220, kinds[kind] ? 255 : 95);
    textSize(5);
    textAlign("center");
    text(getKindLabel(kind), 115 + i * 13, 118);
  }
}

function drawHeader() {
  rectMode(CORNER);
  noStroke();

  fill(10, 13, 20, 244);
  rect(0, 292, GAME_W, 28);
  fill(100, 72, 56);
  rect(0, 292, GAME_W, 2);

  fill(239, 228, 200);
  textSize(10);
  textAlign("left");
  text("今夜のおでん", 8, 303);

  fill(180, 187, 198);
  textSize(7);
  textAlign("right");
  text("鍋を囲む夜", 172, 304);

  // 一巡ごとに提灯が一つ灯る。回数を数字で言わない。
  for (let i = 0; i < TURNS_PER_NIGHT; i++) {
    const lit = i < model.turn;
    fill(lit ? 236 : 91, lit ? 183 : 77, lit ? 88 : 63);
    rect(78 + i * 8, 298, 5, 8);
  }
}

function drawMessage() {
  rectMode(CORNER);
  noStroke();

  fill(14, 18, 27, 235);
  rect(9, 130, 162, 40);
  fill(95, 69, 54);
  rect(9, 167, 162, 3);

  let speaker = "あなた";
  if (model.state === STATE.RIVALS_TURN) {
    speaker = model.rivalPhase === 0 ? LEFT_RIVAL.name : RIGHT_RIVAL.name;
  }

  fill(240, 221, 185);
  textSize(9);
  textAlign("left");
  text(speaker, 17, 157);

  fill(211, 215, 219);
  textSize(8);
  drawSplitText(model.message, 17, 140, 19, 10);
}

function drawControls() {
  if (model.state !== STATE.PLAYER_TURN) return;

  const wait = getWaitRect();
  rectMode(CORNER);
  noStroke();

  fill(111, 61, 43);
  rect(wait.x, wait.y, wait.w, wait.h);
  fill(205, 130, 76);
  rect(wait.x + 3, wait.y + 3, wait.w - 6, wait.h - 6);

  fill(255, 243, 217);
  textSize(9);
  textAlign("center");
  text("今日は、少し待つ", GAME_W / 2, 22);

  fill(245, 232, 205, 155 + Math.sin(ElapsedTime * 5) * 35);
  textSize(7);
  text("具をタップして取る", GAME_W / 2, 44);
}

function drawResult() {
  rectMode(CORNER);
  noStroke();

  fill(5, 8, 14, 198);
  rect(0, 0, GAME_W, GAME_H);

  fill(65, 47, 39);
  rect(14, 32, 152, 248);
  fill(231, 218, 190);
  rect(17, 35, 146, 242);
  fill(246, 237, 216);
  rect(21, 39, 138, 234);

  fill(79, 54, 41);
  textSize(15);
  textAlign("center");
  text(model.resultTitle, GAME_W / 2, 234);

  // 最後に選んだ椀を小さく見せる。
  fill(115, 70, 47);
  rect(49, 181, 82, 26);
  fill(184, 125, 62);
  rect(54, 185, 72, 14);
  for (let i = 0; i < model.playerBowl.length; i++) {
    const dish = model.playerBowl[i];
    const px = 58 + (i % 3) * 22;
    const py = 188 + Math.floor(i / 3) * 7;
    drawPixelArt(px, py, ART[dish.visual], 1.1);
  }

  fill(117, 79, 57);
  rect(33, 171, 114, 2);

  fill(83, 57, 43);
  textSize(9);
  drawSplitText(model.resultLine, 37, 139, 16, 13);

  fill(110, 60, 43);
  rect(33, 34, 114, 28);
  fill(255, 241, 214);
  textSize(9);
  textAlign("center");
  text("もう一杯、囲む", GAME_W / 2, 44);
}

function drawTitle() {
  rectMode(CORNER);
  noStroke();

  fill(15, 19, 30);
  rect(0, 0, GAME_W, GAME_H);
  fill(28, 34, 47);
  rect(0, 180, GAME_W, 112);

  fill(41, 45, 58);
  rect(0, 188, 24, 75);
  rect(30, 188, 28, 88);
  rect(65, 188, 25, 67);
  rect(97, 188, 37, 88);
  rect(141, 188, 22, 62);
  rect(167, 188, 13, 90);

  fill(55, 59, 64);
  rect(16, 126, 148, 59);
  fill(104, 109, 114);
  rect(20, 130, 140, 51);
  fill(44, 46, 50);
  rect(24, 134, 132, 39);
  fill(203, 145, 68);
  rect(27, 138, 126, 27);

  drawPixelArt(44, 143, ART.daikon, 3);
  drawPixelArt(82, 143, ART.egg, 3);
  drawPixelArt(119, 143, ART.ganmo, 3);

  for (let i = 0; i < 5; i++) {
    const sx = 40 + i * 24 + Math.sin(ElapsedTime * 1.2 + i) * 3;
    const sh = 11 + (i % 2) * 8;
    fill(244, 239, 222, 42);
    rect(sx, 164, 6, sh);
  }

  fill(245, 233, 208);
  textSize(23);
  textAlign("center");
  text("今夜のおでん", GAME_W / 2, 239);

  fill(190, 196, 205);
  textSize(9);
  text("同じ鍋から、何を取るか。", GAME_W / 2, 219);
  text("待てば染みる。でも、誰かが取る。", GAME_W / 2, 205);

  fill(245, 233, 208, 150 + Math.sin(ElapsedTime * 5) * 80);
  textSize(9);
  text("タップして、鍋を囲む", GAME_W / 2, 56);
}
