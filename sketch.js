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
  name: "学生さん",
  coat: { r: 43, g: 53, b: 66 },
  hair: { r: 28, g: 29, b: 31 },
  style: "COMPACT"
};

const RIGHT_RIVAL = {
  name: "常連さん",
  coat: { r: 84, g: 37, b: 38 },
  hair: { r: 32, g: 28, b: 29 },
  style: "SLOW"
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
  // レイアウト検証版：鍋そのものを盤面にする。
  const positions = [
    { x: 35, y: 216 },
    { x: 76, y: 216 },
    { x: 117, y: 216 },
    { x: 35, y: 187 },
    { x: 76, y: 187 },
    { x: 117, y: 187 }
  ];
  const p = positions[index] || positions[0];
  return { x: p.x, y: p.y, w: 28, h: 24 };
}

function getPassRect() {
  return { x: 139, y: 33, w: 33, h: 17 };
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
    // レイアウト検証版：背景とコード描画だけで、
    // 「鍋→人物→自分の椀→メッセージ」の読み順を確かめる。
    drawBackground();
    drawRivals();
    drawVendor();
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
  const width = compact ? 28 : 70;
  const height = compact ? 3 : 5;
  const ratio = Math.max(0, Math.min(1, used / BOWL_LIMIT));

  fill(76, 58, 46, 150);
  rect(x, y, width, height);

  if (ratio <= 0) {
    return;
  }

  let fillR = 189;
  let fillG = 132;
  let fillB = 69;

  if (ratio >= 0.8) {
    fillR = 217;
    fillG = 159;
    fillB = 77;
  } else if (ratio >= 0.55) {
    fillR = 204;
    fillG = 145;
    fillB = 71;
  }

  fill(fillR, fillG, fillB);
  rect(x, y, width * ratio, height);

  fill(255, 228, 167, 55);
  rect(x, y + height - 1, width * ratio, 1);
}


function drawBowlDish(dish, index, x, y, isPlayer) {
  const positions = [
    { x: 13, y: 8 },
    { x: 42, y: 7 },
    { x: 68, y: 8 },
    { x: 27, y: 19 },
    { x: 57, y: 20 },
    { x: 44, y: 29 }
  ];

  const p = positions[Math.min(index, positions.length - 1)];

  let size = 1.4;

  if (dish.space >= 6) {
    size = 2.65;
  } else if (dish.space >= 4) {
    size = 2.2;
  } else if (dish.space >= 3) {
    size = 1.95;
  } else if (dish.space >= 2) {
    size = 1.65;
  }

  const pulse =
    model.lastTaken === dish &&
    model.lastTakenBy === "PLAYER" &&
    isPlayer
      ? Math.sin(ElapsedTime * 18) * 1.2
      : 0;

  if (dish.special) {
    fill(255, 218, 132, 48);
    rect(
      x + p.x - 4,
      y + p.y - 3,
      22,
      17
    );
  } else if (dish.broth >= 2) {
    fill(255, 214, 134, 25);
    rect(
      x + p.x - 3,
      y + p.y - 2,
      19,
      14
    );
  }

  drawPixelArt(
    x + p.x,
    y + p.y + pulse,
    ART[dish.visual],
    size
  );
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
// Codea Liteでは ellipseMode / CENTER 定数を使わない。
// 楕円は常に左下基準の ellipse() として呼び、ここで中心基準へ変換する。
function drawOvalCenter(cx, cy, w, h) {
  ellipse(cx - w / 2, cy - h / 2, w, h);
}

function drawBackground() {
  rectMode(CORNER);
  noStroke();

  // 生成りの紙地。個別アセットを入れる前に、夜のポスター構図だけを試す。
  fill(238, 224, 190);
  rect(0, 0, GAME_W, GAME_H);

  // 上部の夜空。ここには後で月・梅・雲の背景画像を差し替えられる。
  fill(18, 30, 47);
  rect(0, 246, GAME_W, 74);

  fill(239, 218, 161);
  drawOvalCenter(30, 286, 22, 22);

  // 星は少量。装飾ではなく、上部の黒い面を静かに保つ。
  fill(239, 218, 161);
  const stars = [
    [52, 299], [71, 284], [99, 304], [125, 279], [145, 297]
  ];
  for (let i = 0; i < stars.length; i++) {
    drawOvalCenter(stars[i][0], stars[i][1], 2, 2);
  }

  // 雲文様の仮置き。アセット化前なので単純な横線に抑える。
  fill(238, 224, 190);
  rect(0, 262, 28, 3);
  rect(5, 268, 40, 3);
  rect(132, 263, 48, 3);
  rect(145, 270, 35, 3);

  // 左右だけに町のシルエットを置き、中央を鍋と人物のために空ける。
  fill(25, 35, 43);
  rect(0, 101, 18, 68);
  rect(18, 112, 16, 57);
  rect(146, 105, 17, 64);
  rect(163, 118, 17, 51);

  fill(56, 44, 43);
  rect(2, 110, 13, 48);
  rect(20, 122, 12, 37);
  rect(151, 115, 10, 42);
  rect(166, 126, 11, 31);

  // 街灯の仮シルエット。
  fill(24, 29, 36);
  rect(10, 154, 2, 36);
  rect(168, 154, 2, 36);
  fill(187, 125, 62);
  rect(8, 187, 6, 5);
  rect(166, 187, 6, 5);

  // 奥の屋根。人物の周囲はあえて何も描かない。
  fill(74, 63, 55);
  rect(38, 128, 24, 12);
  rect(118, 128, 24, 12);
  fill(33, 42, 47);
  rect(42, 140, 17, 19);
  rect(121, 140, 17, 19);

  // 紙の印刷ムラを、固定位置の小さな点でだけ加える。
  fill(102, 75, 53, 20);
  for (let i = 0; i < 24; i++) {
    const px = (i * 37 + 11) % GAME_W;
    const py = 35 + ((i * 53) % 198);
    rect(px, py, 1, 1);
  }
}

function drawOrderTicket(x, y, who, used) {
  rectMode(CORNER);
  noStroke();

  // 個別の注文札アセットを入れる前のサイズ検証用ダミー。
  fill(61, 47, 39);
  rect(x, y, 31, 48);
  fill(239, 225, 191);
  rect(x + 2, y + 2, 27, 44);

  fill(132, 63, 47);
  rect(x + 4, y + 37, 23, 2);

  fill(73, 51, 40);
  textSize(6);
  textAlign("center");
  text("注文", x + 15.5, y + 39);

  // ここは、将来「客ごとの本当の注文」に置き換える。
  if (who === "LEFT") {
    drawPixelArt(x + 6, y + 22, ART.chikuwa, 0.75);
    drawPixelArt(x + 17, y + 22, ART.konnyaku, 0.75);
  } else {
    drawPixelArt(x + 6, y + 22, ART.daikon, 0.75);
    drawPixelArt(x + 17, y + 22, ART.egg, 0.75);
  }

  fill(80, 59, 44);
  textSize(5);
  textAlign("center");
  text("椀 " + used + "/10", x + 15.5, y + 7);
}

function drawRivalPerson(x, rival, bowl, used, side) {
  rectMode(CORNER);
  noStroke();

  const isStudent = side === "LEFT";
  const y = 91;
  const isTaking =
    (side === "LEFT" && model.lastTakenBy === "LEFT") ||
    (side === "RIGHT" && model.lastTakenBy === "RIGHT");
  const bob = isTaking ? Math.sin(ElapsedTime * 18) * 1.2 : 0;

  // 下半身ではなく胸から上だけ。個別人物アセットの最終配置を先に検証する。
  if (isStudent) {
    fill(30, 39, 52);
    rect(x - 17, y + bob, 34, 45);

    fill(234, 209, 171);
    rect(x - 7, y + 34 + bob, 14, 18);
    fill(24, 28, 32);
    rect(x - 10, y + 49 + bob, 20, 8);
    rect(x - 8, y + 57 + bob, 16, 4);

    fill(27, 30, 34);
    rect(x + 3, y + 43 + bob, 2, 2);
    fill(99, 67, 52);
    rect(x + 3, y + 37 + bob, 3, 1);
  } else {
    fill(61, 36, 39);
    rect(x - 17, y + bob, 34, 45);

    fill(235, 207, 174);
    rect(x - 7, y + 34 + bob, 14, 18);
    fill(28, 27, 29);
    rect(x - 9, y + 49 + bob, 18, 7);
    rect(x - 12, y + 44 + bob, 5, 8); // 低い髪のまとめ

    fill(30, 28, 29);
    rect(x - 5, y + 43 + bob, 2, 2);
    fill(129, 56, 48);
    rect(x - 5, y + 37 + bob, 3, 1);
  }

  fill(238, 223, 191);
  textSize(6);
  textAlign("center");
  text(rival.name, x, y - 9);

  const ticketX = isStudent ? 4 : 145;
  drawOrderTicket(ticketX, 137, side, used);
}

function drawRivals() {
  // 左は学生、右は常連女性。二人とも中央の鍋を見る構図。
  drawRivalPerson(27, LEFT_RIVAL, model.leftBowl, model.leftSpace, "LEFT");
  drawRivalPerson(153, RIGHT_RIVAL, model.rightBowl, model.rightSpace, "RIGHT");
}

function drawVendor() {
  rectMode(CORNER);
  noStroke();

  const x = 90;
  const y = 92;

  // 店主は鍋とお椀の間で埋もれないかを試すため、やや上寄り・大きめに置く。
  fill(34, 53, 69);
  rect(x - 18, y, 36, 45);

  fill(232, 205, 171);
  rect(x - 8, y + 34, 16, 19);

  fill(35, 31, 29);
  rect(x - 9, y + 49, 18, 6);

  fill(238, 224, 190);
  rect(x - 10, y + 56, 20, 4);
  fill(47, 56, 64);
  rect(x - 8, y + 56, 4, 4);
  rect(x + 2, y + 56, 4, 4);

  fill(41, 33, 31);
  rect(x - 5, y + 42, 2, 2);
  rect(x + 3, y + 42, 2, 2);

  fill(238, 223, 191);
  textSize(6);
  textAlign("center");
  text("店主", x, y - 9);
}

function drawCounter() {
  rectMode(CORNER);
  noStroke();

  // 手前の屋台。上面を低くして、人物とプレイヤー椀を前後に分ける。
  fill(52, 37, 32);
  rect(0, 28, GAME_W, 48);

  fill(95, 61, 43);
  rect(0, 32, GAME_W, 39);

  fill(39, 30, 29);
  rect(0, 73, GAME_W, 8);

  // 太い横線と少数の節だけ。アセット化時の木目密度をここで確認する。
  fill(130, 79, 47);
  rect(0, 74, GAME_W, 4);
  fill(72, 44, 35);
  rect(15, 44, 55, 2);
  rect(97, 53, 60, 2);
  rect(28, 62, 40, 2);

  fill(42, 32, 30);
  rect(21, 32, 3, 39);
  rect(70, 32, 3, 39);
  rect(109, 32, 3, 39);
  rect(156, 32, 3, 39);
}

function drawPot() {
  rectMode(CORNER);
  noStroke();

  const cx = 90;
  const cy = 211;


  // 大きな共有鍋。下段カードではなく、鍋の六区画を直接タップする。
  fill(44, 40, 38);
  drawOvalCenter(cx, cy, 150, 82);

  fill(115, 96, 77);
  drawOvalCenter(cx, cy + 1, 142, 76);

  fill(50, 45, 41);
  drawOvalCenter(cx, cy + 3, 132, 66);

  fill(196, 144, 73);
  drawOvalCenter(cx, cy + 3, 122, 56);

  // 持ち手は簡略化。最終アセットの外形だけ先に置く。
  fill(61, 48, 42);
  rect(13, 205, 12, 13);
  rect(155, 205, 12, 13);

  const brothTotal = model.pot.reduce(function(sum, dish) {
    return sum + (dish ? dish.broth : 0);
  }, 0);

  for (let i = 0; i < POT_SIZE; i++) {
    const dish = model.pot[i];
    const slot = getPotSlotRect(i);

    fill(57, 46, 39);
    rect(slot.x - 1, slot.y - 1, slot.w + 2, slot.h + 2);

    if (!dish) {
      fill(136, 98, 60);
      rect(slot.x, slot.y, slot.w, slot.h);
      continue;
    }

    let baseR = 211;
    let baseG = 156;
    let baseB = 76;

    if (dish.broth >= 1) {
      baseR = 219;
      baseG = 165;
      baseB = 80;
    }
    if (dish.broth >= 2) {
      baseR = 228;
      baseG = 177;
      baseB = 88;
    }
    if (dish.special) {
      baseR = 240;
      baseG = 194;
      baseB = 104;
    }

    fill(baseR, baseG, baseB);
    rect(slot.x, slot.y, slot.w, slot.h);

    const selectable =
      model.state === STATE.PLAYER_TURN &&
      model.canTake("PLAYER", dish);

    if (selectable) {
      fill(255, 239, 190, 38 + Math.sin(ElapsedTime * 4 + i) * 16);
      rect(slot.x + 1, slot.y + 1, slot.w - 2, slot.h - 2);
    } else if (model.state === STATE.PLAYER_TURN) {
      fill(30, 27, 27, 68);
      rect(slot.x + 1, slot.y + 1, slot.w - 2, slot.h - 2);
    }

    if (dish.special) {
      fill(252, 235, 177);
      rect(slot.x, slot.y + slot.h - 2, slot.w, 2);
    }

    let dishSize = 1.45;
    if (dish.space >= 6) dishSize = 1.9;
    else if (dish.space >= 4) dishSize = 1.7;
    else if (dish.space >= 3) dishSize = 1.55;

    const artW = 6 * dishSize;
    const artH = 6 * dishSize;
    drawPixelArt(
      slot.x + (slot.w - artW) / 2,
      slot.y + (slot.h - artH) / 2,
      ART[dish.visual],
      dishSize
    );
  }

  // 簡易湯気。専用アセットに差し替える位置の確認用。
  const steamCount = 2 + Math.min(3, brothTotal);
  for (let i = 0; i < steamCount; i++) {
    const sx = 68 + i * 10 + Math.sin(ElapsedTime * 1.7 + i) * 1.2;
    fill(240, 227, 196, 70);
    rect(sx, 252 + (i % 2) * 3, 3, 9);
  }

  fill(59, 43, 36);
  textSize(7);
  textAlign("center");
  text("みんなの鍋", cx, 169);
}


function drawPlayerBowl() {
  rectMode(CORNER);
  noStroke();

  const cx = 90;
  const cy = 82;
  const innerX = 48;
  const innerY = 73;
  const innerW = 84;
  const innerH = 15;
  const segmentW = innerW / BOWL_LIMIT;


  // 手前の大きな椀。少し下げて店主の顔を隠さない配置にする。
  fill(57, 42, 36);
  drawOvalCenter(cx, cy, 112, 51);

  fill(228, 216, 188);
  drawOvalCenter(cx, cy + 2, 102, 43);

  fill(57, 45, 40);
  drawOvalCenter(cx, cy + 4, 90, 27);

  fill(190, 133, 66);
  rect(innerX, innerY, innerW, innerH);

  let usedSpace = 0;
  for (let i = 0; i < model.playerBowl.length; i++) {
    const dish = model.playerBowl[i];
    const dishX = innerX + usedSpace * segmentW;
    const dishW = dish.space * segmentW;
    const kindColor = getSlotKindColor(dish);

    fill(
      dish.special ? 244 : kindColor.r,
      dish.special ? 203 : kindColor.g,
      dish.special ? 123 : kindColor.b
    );
    rect(dishX, innerY, dishW, innerH);

    let artSize = 0.62;
    if (dish.space >= 6) artSize = 1.0;
    else if (dish.space >= 4) artSize = 0.84;
    else if (dish.space >= 3) artSize = 0.72;

    const artW = 6 * artSize;
    const artH = 6 * artSize;
    drawPixelArt(
      dishX + (dishW - artW) / 2,
      innerY + (innerH - artH) / 2,
      ART[dish.visual],
      artSize
    );

    usedSpace += dish.space;
  }

  for (let i = 1; i < BOWL_LIMIT; i++) {
    fill(68, 47, 38, 140);
    rect(innerX + i * segmentW - 0.6, innerY, 1.2, innerH);
  }

  if (model.playerBowl.length === 0) {
    fill(242, 225, 187, 145);
    textSize(6);
    textAlign("center");
    text("まだ、空いている", cx, 78);
  }

  fill(238, 224, 190);
  textSize(7);
  textAlign("center");
  text("あなたのお椀  " + model.playerSpace + "/10", cx, 47);
}



function drawHeader() {
  rectMode(CORNER);
  noStroke();

  // 左上は将来、赤提灯アセットを置く位置。
  fill(169, 61, 43);
  rect(8, 258, 20, 39);
  fill(35, 30, 29);
  rect(8, 255, 20, 4);
  rect(8, 297, 20, 3);

  fill(238, 224, 190);
  textSize(7);
  textAlign("center");
  text("湯間庭", 18, 276);

  // 右上は巡り札。大きなタイトル帯をなくし、夜空の余白を残す。
  fill(57, 44, 38);
  rect(149, 251, 23, 48);
  fill(239, 225, 191);
  rect(151, 253, 19, 44);

  fill(64, 46, 38);
  textSize(6);
  textAlign("center");
  text((model.turn + 1) + "巡目", 160.5, 286);

  for (let i = 0; i < TURNS_PER_NIGHT; i++) {
    const lit = i < model.turn;
    fill(lit ? 174 : 72, lit ? 64 : 55, lit ? 44 : 43);
    drawOvalCenter(160.5, 273 - i * 6, 3.5, 3.5);
  }
}

function drawMessage() {
  rectMode(CORNER);
  noStroke();

  const boxX = 5;
  const boxY = 4;
  const boxW = 170;
  const boxH = 25;

  fill(15, 24, 38);
  rect(boxX, boxY, boxW, boxH);

  fill(223, 190, 116);
  rect(boxX, boxY + boxH - 2, boxW, 2);

  let speaker = "あなた";
  if (model.state === STATE.RIVALS_TURN) {
    speaker = model.rivalPhase === 0 ? LEFT_RIVAL.name : RIGHT_RIVAL.name;
  }

  fill(239, 225, 191);
  textSize(6);
  textAlign("left");
  text(speaker, boxX + 7, boxY + 16);

  fill(224, 224, 218);
  textSize(6);
  drawSplitText(model.message, boxX + 31, boxY + 6, 24, 7);
}


function drawControls() {
  if (model.state !== STATE.PLAYER_TURN) return;

  const pass = getPassRect();
  rectMode(CORNER);
  noStroke();

  fill(84, 59, 42);
  rect(pass.x, pass.y, pass.w, pass.h);
  fill(238, 224, 190);
  rect(pass.x + 2, pass.y + 2, pass.w - 4, pass.h - 4);

  fill(74, 48, 37);
  textSize(6);
  textAlign("center");
  text("余白", pass.x + pass.w / 2, pass.y + 5);

  fill(238, 224, 190, 185 + Math.sin(ElapsedTime * 5) * 30);
  textSize(6);
  text("鍋の具を選ぶ", 90, 35);
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
