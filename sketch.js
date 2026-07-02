// ==========================================
// コトコトおでん(仮)
// 共有鍋・お椀容量つき試作版
// Codea Lite / 完全差し替え用
// ==========================================

const GAME_W = 180;
const GAME_H = 320;
const POT_SIZE = 6;
const BOWL_LIMIT = 10;
const TURNS_PER_NIGHT = 5;

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
  "R": { r: 202, g: 91, b: 73 }, "r": { r: 150, g: 57, b: 47 },
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
  shirataki: ["  SS  ", " SSSS ", "sSSsSS", "ssssss", " ssss ", "  ss  "],
  wing: ["   RR  ", " RRRRR ", "RRrrRR", " rrrrr ", "  rr   ", "  r    "]
};

// score は最後の評価だけに使う。画面では「うまみの粒」で読む。
// space はお椀の 10 区画をどれだけ埋めるか。
const DISHES = [
  { id: "SHIRATAKI", name: "しらたき", visual: "shirataki", score: 1, space: 1, specialBonus: 1, tag: "軽" },
  { id: "KONNYAKU", name: "こんにゃく", visual: "konnyaku", score: 2, space: 1, specialBonus: 1, tag: "軽" },
  { id: "CHIKUWA", name: "ちくわ", visual: "chikuwa", score: 2, space: 2, specialBonus: 2, tag: "軽" },
  { id: "EGG", name: "たまご", visual: "egg", score: 3, space: 2, specialBonus: 2, tag: "染" },
  { id: "DAIKON", name: "だいこん", visual: "daikon", score: 3, space: 3, specialBonus: 4, tag: "染" },
  { id: "GANMODOKI", name: "がんも", visual: "ganmo", score: 4, space: 3, specialBonus: 2, tag: "染" },
  { id: "BEEF_TENDON", name: "牛すじ", visual: "beef", score: 2, space: 2, specialBonus: 5, tag: "煮" },
  { id: "MOCHI_POUCH", name: "餅巾着", visual: "mochi", score: 5, space: 4, specialBonus: 2, tag: "重" },
  { id: "WING", name: "手羽先", visual: "wing", score: 6, space: 6, specialBonus: 1, tag: "重" }
];

const LEFT_RIVAL = {
  name: "常連さん",
  coat: { r: 80, g: 61, b: 48 },
  hair: { r: 47, g: 40, b: 36 },
  style: "SLOW"
};

const RIGHT_RIVAL = {
  name: "学生さん",
  coat: { r: 64, g: 80, b: 108 },
  hair: { r: 35, g: 35, b: 40 },
  style: "COMPACT"
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

    this.playerSpace = 0;
    this.leftSpace = 0;
    this.rightSpace = 0;

    this.turn = 0;
    this.rivalPhase = 0;
    this.rivalTimer = 0;
    this.stateT = 0;

    this.message = "";
    this.lastTaken = null;
    this.lastTakenBy = "";
    this.lastEvent = "";

    this.resultTitle = "";
    this.resultLine = "";
    this.resultRank = "";
  }

  makeDeck() {
    const deck = [];
    const add = (id, count) => {
      const base = DISHES.find(dish => dish.id === id);
      for (let i = 0; i < count; i++) {
        deck.push({ ...base, broth: 0, special: false });
      }
    };

    add("SHIRATAKI", 3);
    add("KONNYAKU", 3);
    add("CHIKUWA", 3);
    add("EGG", 3);
    add("DAIKON", 3);
    add("GANMODOKI", 3);
    add("BEEF_TENDON", 3);
    add("MOCHI_POUCH", 2);
    add("WING", 2);

    return deck.sort(() => Math.random() - 0.5);
  }

  drawDish() {
    if (this.deck.length === 0) return null;
    return this.deck.pop();
  }

  fillEmptyPotSlots() {
    for (let i = 0; i < POT_SIZE; i++) {
      if (this.pot[i] !== null && this.pot[i] !== undefined) continue;
      this.pot[i] = this.drawDish();
    }
  }

  startNight() {
    this.reset();
    this.deck = this.makeDeck();
    this.pot = new Array(POT_SIZE).fill(null);
    this.fillEmptyPotSlots();

    this.state = STATE.INTRO;
    this.stateT = 0;
    this.message = "鍋を囲む三人の前に、具が並ぶ。\nお椀は、十の区画まで。";
  }

  startPlayerTurn() {
    this.state = STATE.PLAYER_TURN;
    this.stateT = 0;

    if (this.getTakeableIndices("PLAYER").length === 0) {
      this.message = "お椀に入る具が、もう見当たらない。\n今巡りは、箸を休めよう。";
    } else {
      this.message = "一つ取る。空いた場所の両隣に、\nだしがぽとっ、ぽとっと落ちる。";
    }
  }

  getBowlFor(who) {
    if (who === "LEFT") return this.leftBowl;
    if (who === "RIGHT") return this.rightBowl;
    return this.playerBowl;
  }

  getSpaceFor(who) {
    if (who === "LEFT") return this.leftSpace;
    if (who === "RIGHT") return this.rightSpace;
    return this.playerSpace;
  }

  setSpaceFor(who, value) {
    if (who === "LEFT") this.leftSpace = value;
    else if (who === "RIGHT") this.rightSpace = value;
    else this.playerSpace = value;
  }

  canTake(who, dish) {
    if (!dish) return false;
    return this.getSpaceFor(who) + dish.space <= BOWL_LIMIT;
  }

  getTakeableIndices(who) {
    const indices = [];
    for (let i = 0; i < POT_SIZE; i++) {
      if (this.canTake(who, this.pot[i])) indices.push(i);
    }
    return indices;
  }

  getDishScore(dish) {
    if (!dish) return 0;
    return dish.score + (dish.special ? dish.specialBonus : 0);
  }

  getBowlScore(bowl) {
    return bowl.reduce((total, dish) => total + this.getDishScore(dish), 0);
  }

  addToBowl(who, dish) {
    const bowl = this.getBowlFor(who);
    bowl.push(dish);
    this.setSpaceFor(who, this.getSpaceFor(who) + dish.space);
  }

  takePotDish(index, who) {
    const dish = this.pot[index];
    if (!this.canTake(who, dish)) return null;

    this.pot[index] = null;
    this.addToBowl(who, dish);

    this.lastTaken = dish;
    this.lastTakenBy = who;
    this.lastEvent = "";

    this.dropBrothAround(index);
    this.resolvePotChanges();
    this.fillEmptyPotSlots();

    return dish;
  }

  dropBrothAround(index) {
    const left = (index + POT_SIZE - 1) % POT_SIZE;
    const right = (index + 1) % POT_SIZE;

    this.addBrothToSlot(left);
    this.addBrothToSlot(right);
  }

  addBrothToSlot(index) {
    const dish = this.pot[index];
    if (!dish) return;

    dish.broth += 1;
  }

  resolvePotChanges() {
    const events = [];

    for (let i = 0; i < POT_SIZE; i++) {
      const dish = this.pot[i];
      if (!dish) continue;

      if (dish.broth >= 4) {
        events.push(`${dish.name}が煮崩れた`);
        this.pot[i] = null;
        continue;
      }

      if (dish.broth >= 3 && !dish.special) {
        dish.special = true;
        events.push(`${dish.name}が特製になった`);
      }
    }

    if (events.length > 0) {
      this.lastEvent = events.join("。") + "。";
    }
  }

  playerTake(index) {
    const dish = this.takePotDish(index, "PLAYER");
    if (!dish) return;

    const specialText = dish.special ? " 特製を、自分の椀へ。" : "を、自分の椀へ。";
    this.message = `${dish.name}${specialText}\n${this.lastEvent || "隣の具に、だしが回った。"}`;
    this.beginRivalsTurn();
  }

  playerPass() {
    this.lastTaken = null;
    this.lastTakenBy = "";
    this.lastEvent = "";
    this.message = "今は、椀の余白を残しておく。\n隣の二人が、箸を伸ばす。";
    this.beginRivalsTurn();
  }

  beginRivalsTurn() {
    this.state = STATE.RIVALS_TURN;
    this.rivalPhase = 0;
    this.rivalTimer = 0;
    this.stateT = 0;
  }

  chooseRivalDish(rival, who) {
    const choices = this.getTakeableIndices(who);
    if (choices.length === 0) return -1;

    let bestIndex = choices[0];
    let bestScore = -999;

    for (const index of choices) {
      const dish = this.pot[index];
      const value = this.getDishScore(dish);
      let score = value * 2 - dish.space * 0.45 + Math.random() * 2.5;

      if (rival.style === "SLOW") {
        score += dish.broth * 2.3;
        if (dish.special) score += 5;
        if (dish.id === "BEEF_TENDON" || dish.id === "DAIKON") score += 1.4;
      }

      if (rival.style === "COMPACT") {
        score += (4 - Math.min(dish.space, 4)) * 1.4;
        if (dish.space <= 2) score += 2.2;
        if (dish.id === "WING") score -= 4;
      }

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    return bestIndex;
  }

  resolveRivalStep() {
    if (this.rivalPhase === 0) {
      const index = this.chooseRivalDish(LEFT_RIVAL, "LEFT");
      const dish = index >= 0 ? this.takePotDish(index, "LEFT") : null;
      this.message = dish
        ? `${LEFT_RIVAL.name}は、${dish.name}を取った。\n${this.lastEvent || "空いた両隣に、だしが落ちた。"}`
        : `${LEFT_RIVAL.name}は、椀の余白を見て箸を置いた。`;
      this.rivalPhase = 1;
      return;
    }

    if (this.rivalPhase === 1) {
      const index = this.chooseRivalDish(RIGHT_RIVAL, "RIGHT");
      const dish = index >= 0 ? this.takePotDish(index, "RIGHT") : null;
      this.message = dish
        ? `${RIGHT_RIVAL.name}は、${dish.name}を取った。\n${this.lastEvent || "鍋の具が、少し並び替わった。"}`
        : `${RIGHT_RIVAL.name}は、椀を抱えて待っている。`;
      this.rivalPhase = 2;
      return;
    }

    this.finishTableTurn();
  }

  allPlayersBlocked() {
    return this.getTakeableIndices("PLAYER").length === 0 &&
      this.getTakeableIndices("LEFT").length === 0 &&
      this.getTakeableIndices("RIGHT").length === 0;
  }

  finishTableTurn() {
    this.turn += 1;

    if (this.turn >= TURNS_PER_NIGHT || this.allPlayersBlocked()) {
      this.finishNight();
      return;
    }

    this.startPlayerTurn();
  }

  getSpecialCount(bowl) {
    return bowl.filter(dish => dish.special).length;
  }

  finishNight() {
    const score = this.getBowlScore(this.playerBowl);
    const leftScore = this.getBowlScore(this.leftBowl);
    const rightScore = this.getBowlScore(this.rightBowl);
    const specials = this.getSpecialCount(this.playerBowl);

    if (this.playerBowl.length === 0) {
      this.resultTitle = "空いたお椀。";
      this.resultLine = "今夜は、鍋の景色だけを\n眺めて帰ることにした。";
      this.resultRank = "見送り";
    } else if (specials >= 2 && score >= leftScore && score >= rightScore) {
      this.resultTitle = "特製の、ひと椀。";
      this.resultLine = "待った時間も、取った順番も、\nだしの中でちゃんとつながった。";
      this.resultRank = "今夜の一番椀";
    } else if (score >= leftScore && score >= rightScore) {
      this.resultTitle = "今夜の一番椀。";
      this.resultLine = "小さな余白を使い切って、\n鍋の中から、いいところを取った。";
      this.resultRank = "いちばん満ちた椀";
    } else if (specials >= 1) {
      this.resultTitle = "しみた椀。";
      this.resultLine = "欲張らずに残した具が、\n最後に、いちばん印象に残った。";
      this.resultRank = "特製入り";
    } else if (this.playerSpace >= 9) {
      this.resultTitle = "ぎゅうぎゅうの椀。";
      this.resultLine = "大きい具を先に取った夜。\n余白は少ないが、満足は残った。";
      this.resultRank = "満員";
    } else {
      this.resultTitle = "今夜の椀。";
      this.resultLine = "鍋の流れに合わせて取った具が、\n静かに、ひとつの夜になった。";
      this.resultRank = "ほどよい一杯";
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
    { x: 18, y: 194 },
    { x: 67, y: 202 },
    { x: 116, y: 194 },
    { x: 116, y: 165 },
    { x: 67, y: 157 },
    { x: 18, y: 165 }
  ];
  const p = positions[index] || positions[0];
  return { x: p.x, y: p.y, w: 46, h: 25 };
}

function getPassRect() {
  return { x: 41, y: 12, w: 98, h: 25 };
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
    for (let i = 0; i < POT_SIZE; i++) {
      const slot = getPotSlotRect(i);
      const dish = model.pot[i];
      if (!dish) continue;
      if (!model.canTake("PLAYER", dish)) continue;

      if (isInside(x, y, slot.x, slot.y, slot.w, slot.h)) {
        model.playerTake(i);
        lockInput();
        return;
      }
    }

    const pass = getPassRect();
    if (isInside(x, y, pass.x, pass.y, pass.w, pass.h)) {
      model.playerPass();
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
    if (model.rivalTimer > 0.76) {
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

function drawBrothTokens(x, y, count, compact) {
  for (let i = 0; i < count; i++) {
    const wobble = Math.sin(ElapsedTime * 4 + i) * 0.8;
    fill(255, 231, 159, 190);
    rect(x + i * (compact ? 3 : 5) + wobble, y, compact ? 2 : 3, compact ? 2 : 3);
  }
}

function drawTasteMarks(x, y, count) {
  const shown = Math.min(count, 6);
  for (let i = 0; i < shown; i++) {
    fill(246, 217, 142, 220);
    rect(x + i * 3, y, 2, 3);
  }
}

function drawSpaceMarks(x, y, count) {
  const shown = Math.min(count, 6);
  for (let i = 0; i < shown; i++) {
    fill(93, 68, 53, 230);
    rect(x + i * 3, y, 2, 2);
  }
}

function drawCapacityTicks(x, y, used, compact) {
  const size = compact ? 3 : 5;
  const gap = compact ? 1 : 2;

  for (let i = 0; i < BOWL_LIMIT; i++) {
    const filled = i < used;
    fill(filled ? 221 : 91, filled ? 171 : 76, filled ? 91 : 64);
    rect(x + i * (size + gap), y, size, compact ? 3 : 5);
  }
}

function drawBowlDish(dish, index, x, y, isPlayer) {
  const positions = [
    { x: 13, y: 8 }, { x: 42, y: 7 }, { x: 68, y: 8 },
    { x: 27, y: 19 }, { x: 57, y: 20 }, { x: 44, y: 29 }
  ];
  const p = positions[Math.min(index, positions.length - 1)];
  const size = dish.space >= 5 ? 2.1 : (dish.space >= 3 ? 1.9 : 1.6);
  const pulse = model.lastTaken === dish && model.lastTakenBy === "PLAYER" && isPlayer
    ? Math.sin(ElapsedTime * 18) * 1.2
    : 0;

  if (dish.special) {
    fill(255, 220, 142, 36);
    rect(x + p.x - 3, y + p.y - 2, 20, 15);
  }

  drawPixelArt(x + p.x, y + p.y + pulse, ART[dish.visual], size);
}

function getSlotKindColor(dish) {
  if (dish.tag === "重") return { r: 130, g: 59, b: 48 };
  if (dish.tag === "煮") return { r: 129, g: 82, b: 54 };
  if (dish.tag === "染") return { r: 95, g: 91, b: 56 };
  return { r: 72, g: 91, b: 103 };
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

function drawRivalPerson(x, rival, bowl, used, side) {
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

  fill(61, 39, 34);
  rect(x - 13, 235, 26, 8);
  fill(184, 127, 66);
  rect(x - 10, 238, 20, 3);

  for (let i = 0; i < bowl.length && i < 3; i++) {
    drawPixelArt(x - 9 + i * 6, 241, ART[bowl[i].visual], 0.8);
  }

  drawCapacityTicks(x - 14, 232, used, true);

  fill(229, 218, 193);
  textSize(6);
  textAlign("center");
  text(rival.name, x, 304);
}

function drawRivals() {
  drawRivalPerson(25, LEFT_RIVAL, model.leftBowl, model.leftSpace, "LEFT");
  drawRivalPerson(155, RIGHT_RIVAL, model.rightBowl, model.rightSpace, "RIGHT");
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
  rect(8, 150, 164, 93);
  fill(104, 109, 114);
  rect(11, 153, 158, 87);
  fill(43, 45, 49);
  rect(15, 156, 150, 80);
  fill(198, 142, 67);
  rect(18, 159, 144, 73);

  const brothTotal = model.pot.reduce((sum, dish) => sum + (dish ? dish.broth : 0), 0);
  const steam = 3 + brothTotal;
  for (let i = 0; i < steam; i++) {
    const sx = 27 + ((i * 19) % 125) + Math.sin(ElapsedTime * 1.6 + i) * 2;
    const sy = 225 + (i % 2) * 3;
    fill(250, 239, 211, 22 + (i % 3) * 11);
    rect(sx, sy, 4, 8 + (i % 2) * 4);
  }

  // 円の中に 6 つの具。空いた場所の左右にだしが回る。
  for (let i = 0; i < POT_SIZE; i++) {
    const dish = model.pot[i];
    const slot = getPotSlotRect(i);

    fill(75, 59, 47);
    rect(slot.x - 1, slot.y - 1, slot.w + 2, slot.h + 2);

    if (!dish) {
      fill(118, 86, 57);
      rect(slot.x, slot.y, slot.w, slot.h);
      continue;
    }

    fill(dish.special ? 238 : 230, dish.special ? 190 : 177, dish.special ? 98 : 89);
    rect(slot.x, slot.y, slot.w, slot.h);
    fill(255, 225, 158, 28);
    rect(slot.x + 2, slot.y + 2, slot.w - 4, slot.h - 4);

    const selectable = model.state === STATE.PLAYER_TURN && model.canTake("PLAYER", dish);
    if (selectable) {
      fill(255, 243, 213, 28 + Math.sin(ElapsedTime * 4 + i) * 15);
      rect(slot.x + 1, slot.y + 1, slot.w - 2, slot.h - 2);
    } else if (model.state === STATE.PLAYER_TURN) {
      fill(35, 31, 29, 70);
      rect(slot.x + 1, slot.y + 1, slot.w - 2, slot.h - 2);
    }

    drawPixelArt(slot.x + 4, slot.y + 9, ART[dish.visual], 1.3);

    fill(71, 49, 37);
    textSize(5);
    textAlign("left");
    text(dish.name, slot.x + 17, slot.y + 13);

    const tagColor = getSlotKindColor(dish);
    fill(tagColor.r, tagColor.g, tagColor.b);
    rect(slot.x + 18, slot.y + 4, 7, 5);
    fill(255, 244, 220);
    textSize(5);
    textAlign("center");
    text(dish.tag, slot.x + 21.5, slot.y + 5);

    // 金の粒はうまみ、濃い茶の粒はお椀で使う場所。
    // 数字を読ませず、手羽先の「大きさ」を目で判断できるようにする。
    drawTasteMarks(slot.x + 27, slot.y + 7, dish.score);
    drawSpaceMarks(slot.x + 27, slot.y + 3, dish.space);
    drawBrothTokens(slot.x + 28, slot.y + 20, dish.broth, true);

    if (dish.special) {
      fill(255, 242, 183);
      textSize(5);
      textAlign("right");
      text("特", slot.x + slot.w - 4, slot.y + 16);
    }
  }

  fill(238, 224, 195);
  textSize(7);
  textAlign("left");
  text("みんなの鍋", 15, 247);

  fill(108, 78, 54);
  textSize(6);
  textAlign("right");
  text("だし 3 で特製 4 で煮崩れ", 165, 247);
}

function drawPlayerBowl() {
  rectMode(CORNER);
  noStroke();

  const x = 38;
  const y = 57;

  fill(8, 10, 14, 105);
  rect(x + 11, y - 5, 96, 5);

  fill(76, 45, 38);
  rect(x, y, 106, 56);
  fill(117, 67, 48);
  rect(x + 4, y + 4, 98, 48);
  fill(224, 208, 176);
  rect(x + 9, y + 42, 88, 6);
  fill(83, 51, 38);
  rect(x + 12, y + 9, 82, 35);
  fill(182, 125, 62);
  rect(x + 15, y + 13, 76, 27);

  for (let i = 0; i < model.playerBowl.length; i++) {
    drawBowlDish(model.playerBowl[i], i, x, y, true);
  }

  if (model.playerBowl.length === 0) {
    fill(240, 221, 182, 130);
    textSize(7);
    textAlign("center");
    text("まだ、空いている", GAME_W / 2, 80);
  }

  fill(228, 216, 191);
  textSize(7);
  textAlign("left");
  text("あなたのお椀", 40, 120);

  fill(156, 116, 72);
  textSize(6);
  text("余白", 40, 111);
  drawCapacityTicks(58, 109, model.playerSpace, false);
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
  text("コトコトおでん", 8, 303);

  fill(180, 187, 198);
  textSize(7);
  textAlign("right");
  text("鍋を囲む夜", 172, 304);

  // 一巡ごとに提灯が一つ灯る。
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
  rect(9, 127, 162, 40);
  fill(95, 69, 54);
  rect(9, 164, 162, 3);

  let speaker = "あなた";
  if (model.state === STATE.RIVALS_TURN) {
    speaker = model.rivalPhase === 0 ? LEFT_RIVAL.name : RIGHT_RIVAL.name;
  }

  fill(240, 221, 185);
  textSize(9);
  textAlign("left");
  text(speaker, 17, 154);

  fill(211, 215, 219);
  textSize(8);
  drawSplitText(model.message, 17, 137, 19, 10);
}

function drawControls() {
  if (model.state !== STATE.PLAYER_TURN) return;

  const pass = getPassRect();
  rectMode(CORNER);
  noStroke();

  fill(74, 52, 41);
  rect(pass.x, pass.y, pass.w, pass.h);
  fill(230, 216, 188);
  rect(pass.x + 3, pass.y + 3, pass.w - 6, pass.h - 6);

  fill(77, 53, 41);
  textSize(9);
  textAlign("center");
  text("今は、余白を残す", GAME_W / 2, 21);

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

  fill(155, 108, 66);
  textSize(8);
  text(model.resultRank, GAME_W / 2, 218);

  // 最後に選んだ椀を、小さく見せる。
  fill(115, 70, 47);
  rect(43, 180, 94, 30);
  fill(184, 125, 62);
  rect(48, 184, 84, 17);
  for (let i = 0; i < model.playerBowl.length; i++) {
    const dish = model.playerBowl[i];
    const px = 53 + (i % 3) * 24;
    const py = 188 + Math.floor(i / 3) * 8;
    if (dish.special) {
      fill(255, 220, 142, 45);
      rect(px - 2, py - 2, 17, 12);
    }
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

  drawPixelArt(43, 143, ART.daikon, 3);
  drawPixelArt(80, 143, ART.beef, 3);
  drawPixelArt(118, 143, ART.wing, 3);

  for (let i = 0; i < 5; i++) {
    const sx = 40 + i * 24 + Math.sin(ElapsedTime * 1.2 + i) * 3;
    const sh = 11 + (i % 2) * 8;
    fill(244, 239, 222, 42);
    rect(sx, 164, 6, sh);
  }

  fill(245, 233, 208);
  textSize(23);
  textAlign("center");
  text("コトコトおでん", GAME_W / 2, 239);

  fill(190, 196, 205);
  textSize(9);
  text("椀の余白は、十区画だけ。", GAME_W / 2, 219);
  text("取るたび、隣の具にだしが回る。", GAME_W / 2, 205);

  fill(245, 233, 208, 150 + Math.sin(ElapsedTime * 5) * 80);
  textSize(9);
  text("タップして、鍋を囲む", GAME_W / 2, 56);
}
