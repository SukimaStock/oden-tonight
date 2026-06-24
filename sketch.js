// ==========================================
// おでんの限界
// 客として、大将の鍋と張り合う一局ゲーム
// 完全差し替え版 / Codea Lite
// ==========================================

const GAME_W = 180;
const GAME_H = 320;
const LIMIT = 21;
const MASTER_STAND = 17;

const STATE = {
  TITLE: "TITLE",
  DEALING: "DEALING",
  PLAYER_TURN: "PLAYER_TURN",
  PLAYER_BURST: "PLAYER_BURST",
  MASTER_TURN: "MASTER_TURN",
  MASTER_BURST: "MASTER_BURST",
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

// 数字は内部だけで使う。画面には一切出さない。
const DISHES = [
  { id: "SHIRATAKI", name: "しらたき", visual: "shirataki", weight: 2, volume: 1 },
  { id: "KONNYAKU", name: "こんにゃく", visual: "konnyaku", weight: 3, volume: 1 },
  { id: "CHIKUWA", name: "ちくわ", visual: "chikuwa", weight: 4, volume: 1 },
  { id: "EGG", name: "たまご", visual: "egg", weight: 5, volume: 2 },
  { id: "DAIKON", name: "だいこん", visual: "daikon", weight: 6, volume: 2 },
  { id: "GANMODOKI", name: "がんも", visual: "ganmo", weight: 7, volume: 2 },
  { id: "MOCHI_POUCH", name: "餅巾着", visual: "mochi", weight: 9, volume: 3 },
  { id: "BEEF_TENDON", name: "牛すじ", visual: "beef", weight: 10, volume: 3 }
];

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
    this.playerDishes = [];
    this.masterDishes = [];
    this.playerTotal = 0;
    this.masterTotal = 0;
    this.message = "";
    this.resultTitle = "";
    this.resultLine = "";
    this.stateT = 0;
    this.masterStepT = 0;
    this.masterBurst = false;
    this.playerBurst = false;
    this.lastDish = null;
    this.lastDishSide = "";
    this.round = 0;
  }

  makeDeck() {
    const deck = [];

    // 軽い具・普通の具・重い具が、必ず少しずつ混じる。
    const light = ["SHIRATAKI", "KONNYAKU", "CHIKUWA"];
    const middle = ["EGG", "DAIKON", "GANMODOKI"];
    const heavy = ["MOCHI_POUCH", "BEEF_TENDON"];

    for (let i = 0; i < 5; i++) deck.push(this.pickDish(light));
    for (let i = 0; i < 7; i++) deck.push(this.pickDish(middle));
    for (let i = 0; i < 4; i++) deck.push(this.pickDish(heavy));

    return deck;
  }

  pickDish(ids) {
    const candidates = DISHES.filter(dish => ids.includes(dish.id));
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  drawDish() {
    if (this.deck.length === 0) return null;

    const index = Math.floor(Math.random() * this.deck.length);
    return this.deck.splice(index, 1)[0];
  }

  startRound() {
    this.reset();
    this.round += 1;
    this.deck = this.makeDeck();

    // 最初の二品は、大将が自動でよそう。
    this.addPlayerDish(this.drawDish());
    this.addPlayerDish(this.drawDish());

    // 大将の鍋には、最初から一品だけ見えている。
    this.addMasterDish(this.drawDish());

    this.message = "大将が、二品をよそった。\n湯気の向こうで、こちらを見ている。";
    this.state = STATE.DEALING;
    this.stateT = 0;
  }

  addPlayerDish(dish) {
    if (!dish) return;

    this.playerDishes.push(dish);
    this.playerTotal += dish.weight;
    this.lastDish = dish;
    this.lastDishSide = "PLAYER";
  }

  addMasterDish(dish) {
    if (!dish) return;

    this.masterDishes.push(dish);
    this.masterTotal += dish.weight;
    this.lastDish = dish;
    this.lastDishSide = "MASTER";
  }

  playerHit() {
    const dish = this.drawDish();

    if (!dish) {
      this.playerStand();
      return;
    }

    this.addPlayerDish(dish);
    this.message = `大将は、${dish.name}を椀によそった。`;

    if (this.playerTotal > LIMIT) {
      this.playerBurst = true;
      this.state = STATE.PLAYER_BURST;
      this.stateT = 0;
      return;
    }

    this.state = STATE.PLAYER_TURN;
  }

  playerStand() {
    this.message = "あなたが蓋をすると、大将は鍋の底を見た。";
    this.state = STATE.MASTER_TURN;
    this.masterStepT = 0;
    this.stateT = 0;
  }

  takeMasterTurn() {
    if (this.masterTotal >= MASTER_STAND) {
      this.finishRound();
      return;
    }

    const dish = this.drawDish();

    if (!dish) {
      this.finishRound();
      return;
    }

    this.addMasterDish(dish);
    this.message = `大将は、${dish.name}を鍋に足した。`;

    if (this.masterTotal > LIMIT) {
      this.masterBurst = true;
      this.state = STATE.MASTER_BURST;
      this.stateT = 0;
    }
  }

  finishRound() {
    if (this.playerBurst) {
      this.resultTitle = "椀が、こぼれた。";
      this.resultLine = "大将は、黙って湯のみを置いた。";
    } else if (this.masterBurst) {
      this.resultTitle = "鍋が、煮えすぎた。";
      this.resultLine = "大将は笑って、火を弱めた。\n今夜はあなたの勝ち。";
    } else if (this.playerTotal > this.masterTotal) {
      this.resultTitle = "勝負あり。";
      this.resultLine = "あなたのお椀の方が、\nあと少しだけ限界に近かった。";
    } else if (this.playerTotal < this.masterTotal) {
      this.resultTitle = "大将の勝ち。";
      this.resultLine = "鍋の深みは、\nまだこちらの一歩先にあった。";
    } else {
      this.resultTitle = "引き分け。";
      this.resultLine = "湯気の高さが、\nちょうど同じところで止まった。";
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
  inputLockTimer = ElapsedTime + 0.22;
}

function isInside(x, y, rx, ry, rw, rh) {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

function getHitRect() {
  return { x: 16, y: 15, w: 70, h: 28 };
}

function getStandRect() {
  return { x: 94, y: 15, w: 70, h: 28 };
}

function getRetryRect() {
  return { x: 33, y: 34, w: 114, h: 28 };
}

function handleTap(x, y) {
  if (model.state === STATE.TITLE) {
    model.startRound();
    lockInput();
    return;
  }

  if (model.state === STATE.PLAYER_TURN) {
    const hit = getHitRect();
    const stand = getStandRect();

    if (isInside(x, y, hit.x, hit.y, hit.w, hit.h)) {
      model.playerHit();
      lockInput();
    } else if (isInside(x, y, stand.x, stand.y, stand.w, stand.h)) {
      model.playerStand();
      lockInput();
    }

    return;
  }

  if (model.state === STATE.RESULT) {
    const retry = getRetryRect();

    if (isInside(x, y, retry.x, retry.y, retry.w, retry.h)) {
      model.startRound();
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
    drawMaster();
    drawPot();
    drawCounter();
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

  if (model.state === STATE.DEALING && model.stateT > 0.9) {
    model.message = "お椀の具を見て、決める。\nもう一品か。ここで蓋をするか。";
    model.state = STATE.PLAYER_TURN;
    model.stateT = 0;
  }

  if (model.state === STATE.PLAYER_BURST && model.stateT > 0.9) {
    model.finishRound();
  }

  if (model.state === STATE.MASTER_TURN) {
    model.masterStepT += DeltaTime;

    if (model.masterStepT > 0.86) {
      model.masterStepT = 0;
      model.takeMasterTurn();
    }
  }

  if (model.state === STATE.MASTER_BURST && model.stateT > 1.0) {
    model.finishRound();
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

function getDishStackY(index) {
  const pattern = [74, 81, 88, 96, 104, 111, 118];
  return pattern[Math.min(index, pattern.length - 1)];
}

function getDishStackX(index) {
  const pattern = [58, 96, 77, 112, 43, 91, 64];
  return pattern[Math.min(index, pattern.length - 1)];
}

function getMasterDishPosition(index) {
  const positions = [
    { x: 42, y: 207 }, { x: 70, y: 209 }, { x: 99, y: 207 },
    { x: 126, y: 209 }, { x: 55, y: 216 }, { x: 85, y: 217 },
    { x: 114, y: 216 }
  ];

  return positions[Math.min(index, positions.length - 1)];
}

function getPlayerDanger() {
  const t = model.playerTotal;

  if (t > LIMIT) return 3;
  if (t >= 17) return 2;
  if (t >= 12) return 1;
  return 0;
}

function getMasterDanger() {
  const t = model.masterTotal;

  if (t > LIMIT) return 3;
  if (t >= 17) return 2;
  if (t >= 12) return 1;
  return 0;
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

function drawMaster() {
  rectMode(CORNER);
  noStroke();

  // 大将は鍋の向こう側にいる。顔を主張しすぎず、鍋が主役。
  fill(12, 14, 20, 90);
  rect(67, 238, 48, 5);

  fill(67, 57, 48);
  rect(64, 238, 52, 34);

  fill(105, 79, 60);
  rect(68, 243, 44, 26);

  fill(232, 194, 160);
  rect(76, 267, 28, 19);

  fill(47, 40, 37);
  rect(74, 282, 32, 8);
  rect(74, 274, 5, 10);

  fill(35, 31, 30);
  rect(83, 275, 2, 2);
  rect(95, 275, 2, 2);
  rect(86, 269, 8, 1);

  fill(196, 154, 86);
  rect(66, 248, 4, 18);
  rect(110, 248, 4, 18);
}

function drawPot() {
  rectMode(CORNER);
  noStroke();

  const danger = getMasterDanger();
  const simmer = 1 + Math.sin(ElapsedTime * (1.6 + danger * 1.4)) * 0.5;

  // 鍋の外枠
  fill(53, 58, 63);
  rect(18, 187, 144, 46);

  fill(100, 106, 111);
  rect(22, 191, 136, 38);

  fill(43, 45, 49);
  rect(26, 195, 128, 29);

  // 出汁。限界が近いほど、黄色く激しくなる。
  if (danger === 3) {
    fill(82, 72, 76);
  } else if (danger === 2) {
    fill(235, 166, 62);
  } else {
    fill(198, 142, 67);
  }

  rect(29, 199, 122, 19);

  if (danger === 3) {
    fill(133, 83, 102, 95);
    rect(29, 199, 122, 19);
  }

  // 仕切り
  fill(73, 78, 82);
  rect(57, 197, 3, 24);
  rect(91, 197, 3, 24);
  rect(125, 197, 3, 24);

  // 鍋の具。大将が足したぶんだけ、目に見えて増える。
  for (let i = 0; i < model.masterDishes.length; i++) {
    const dish = model.masterDishes[i];
    const p = getMasterDishPosition(i);
    const isLast = model.lastDishSide === "MASTER" && model.lastDish === dish;
    const bounce = isLast ? Math.sin(ElapsedTime * 18) * 2 : 0;

    drawPixelArt(p.x, p.y + bounce, ART[dish.visual], 2);
  }

  // 泡
  const bubbleCount = 4 + danger * 5;
  for (let i = 0; i < bubbleCount; i++) {
    const bx = 34 + ((i * 17 + Math.floor(ElapsedTime * 12)) % 110);
    const by = 201 + ((i * 7 + Math.floor(ElapsedTime * 8)) % 13);
    const size = danger >= 2 ? 3 : 2;

    fill(255, 229, 163, 90 + danger * 30);
    rect(bx, by, size, size);
  }

  // 湯気。限界に近いほど上まで届く。
  const steamCount = 3 + danger * 3;
  for (let i = 0; i < steamCount; i++) {
    const sx = 40 + i * (100 / steamCount);
    const wave = Math.sin(ElapsedTime * (1.2 + danger * 0.6) + i) * 3;
    const height = 9 + danger * 9 + (i % 2) * 4;

    fill(244, 239, 222, 22 + danger * 16);
    rect(sx + wave, 222, 5, height);
  }

  // 煮えすぎは鍋全体が小刻みに揺れるように見せる。
  if (danger === 2) {
    fill(255, 224, 150, 28);
    rect(21, 190, 138, 2 + simmer);
  }

  if (danger === 3) {
    fill(178, 111, 122, 70);
    rect(18, 187, 144, 46);
  }

  fill(231, 216, 185);
  textSize(7);
  textAlign("left");
  text("大将の鍋", 22, 236);
}

function drawCounter() {
  rectMode(CORNER);
  noStroke();

  fill(73, 48, 39);
  rect(0, 145, GAME_W, 32);

  fill(113, 72, 50);
  rect(0, 171, GAME_W, 7);

  fill(60, 40, 35);
  rect(0, 141, GAME_W, 5);

  fill(168, 113, 65, 36);
  rect(0, 164, GAME_W, 2);

  // 取り皿と湯のみ。プレイヤーが客側にいることを示す。
  fill(199, 193, 173);
  rect(145, 151, 17, 8);

  fill(235, 230, 214);
  rect(147, 153, 13, 5);

  fill(54, 62, 67);
  rect(17, 149, 15, 17);

  fill(115, 125, 128);
  rect(19, 151, 11, 13);
}

function drawPlayerBowl() {
  rectMode(CORNER);
  noStroke();

  const danger = getPlayerDanger();
  let shake = 0;

  if (danger === 2) {
    shake = Math.sin(ElapsedTime * 18) * 1.3;
  } else if (danger === 3) {
    shake = Math.sin(ElapsedTime * 26) * 3.2;
  }

  const x = 27 + shake;
  const y = 63;

  // お椀の影
  fill(8, 10, 14, 105);
  rect(x + 11, y - 5, 104, 5);

  // お椀
  fill(76, 45, 38);
  rect(x, y, 126, 50);

  fill(117, 67, 48);
  rect(x + 4, y + 4, 118, 42);

  fill(224, 208, 176);
  rect(x + 9, y + 36, 108, 6);

  fill(83, 51, 38);
  rect(x + 12, y + 9, 102, 29);

  fill(182, 125, 62);
  rect(x + 15, y + 13, 96, 21);

  // 出した具は、椀の中に積み上がる。
  for (let i = 0; i < model.playerDishes.length; i++) {
    const dish = model.playerDishes[i];
    const px = getDishStackX(i) + shake;
    const py = getDishStackY(i);
    const isLast = model.lastDishSide === "PLAYER" && model.lastDish === dish;
    const bounce = isLast ? Math.sin(ElapsedTime * 18) * 2 : 0;
    const size = dish.volume >= 3 ? 2 : 1.7;

    drawPixelArt(px, py + bounce, ART[dish.visual], size);
  }

  // 限界に近づくと、汁が縁まで上がり、小さくこぼれそうになる。
  if (danger >= 1) {
    fill(255, 219, 142, danger === 2 ? 80 : 42);
    rect(x + 20, y + 37, 88, 2);
  }

  if (danger === 2) {
    fill(255, 224, 165, 120);
    rect(x + 17, y + 39, 7, 2);
    rect(x + 99, y + 39, 7, 2);
  }

  if (danger === 3) {
    fill(213, 152, 83);
    rect(x - 3, y + 25, 7, 5);
    rect(x + 122, y + 20, 8, 5);
    rect(x + 24, y - 3, 7, 4);

    fill(243, 212, 161, 110);
    rect(x + 18, y + 41, 90, 3);
  }

  fill(228, 216, 191);
  textSize(7);
  textAlign("left");
  text("あなたのお椀", 30, 121);

  if (danger === 2) {
    fill(253, 225, 166);
    textAlign("right");
    text("カタカタ...", 150, 121);
  }

  if (danger === 3) {
    fill(246, 188, 170);
    textAlign("right");
    text("こぼれた", 150, 121);
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
  text("おでんの限界", 8, 303);

  fill(180, 187, 198);
  textSize(7);
  textAlign("right");
  text("大将と、腹八分目の勝負", 172, 304);
}

function drawMessage() {
  rectMode(CORNER);
  noStroke();

  fill(14, 18, 27, 235);
  rect(9, 130, 162, 40);

  fill(95, 69, 54);
  rect(9, 167, 162, 3);

  let speaker = "大将";

  if (model.state === STATE.PLAYER_TURN) {
    speaker = "あなた";
  }

  if (model.state === STATE.PLAYER_BURST) {
    speaker = "あなた";
  }

  if (model.state === STATE.MASTER_TURN || model.state === STATE.MASTER_BURST) {
    speaker = "大将";
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

  const hit = getHitRect();
  const stand = getStandRect();

  rectMode(CORNER);
  noStroke();

  fill(110, 61, 43);
  rect(hit.x, hit.y, hit.w, hit.h);

  fill(207, 130, 75);
  rect(hit.x + 3, hit.y + 3, hit.w - 6, hit.h - 6);

  // 箸のピクトグラム
  fill(255, 241, 214);
  rect(hit.x + 12, hit.y + 8, 3, 12);
  rect(hit.x + 18, hit.y + 8, 3, 12);

  fill(255, 245, 224);
  textSize(9);
  textAlign("center");
  text("もう一品", hit.x + 47, hit.y + 10);

  fill(71, 51, 40);
  rect(stand.x, stand.y, stand.w, stand.h);

  fill(229, 216, 188);
  rect(stand.x + 3, stand.y + 3, stand.w - 6, stand.h - 6);

  // 蓋のピクトグラム
  fill(83, 59, 45);
  rect(stand.x + 11, stand.y + 10, 14, 6);
  rect(stand.x + 15, stand.y + 16, 6, 2);

  fill(76, 52, 40);
  textSize(8);
  textAlign("center");
  text("ごちそうさん", stand.x + 46, stand.y + 10);
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

  // 決着時は、椀と鍋の様子だけを静かに並べる。
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
  text("もう一度、勝負する", GAME_W / 2, 44);
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

  // 大きな鍋
  fill(55, 59, 64);
  rect(21, 126, 138, 55);

  fill(104, 109, 114);
  rect(25, 130, 130, 47);

  fill(44, 46, 50);
  rect(29, 134, 122, 35);

  fill(203, 145, 68);
  rect(32, 138, 116, 24);

  drawPixelArt(48, 143, ART.daikon, 3);
  drawPixelArt(84, 143, ART.egg, 3);
  drawPixelArt(118, 143, ART.ganmo, 3);

  for (let i = 0; i < 5; i++) {
    const sx = 43 + i * 23 + Math.sin(ElapsedTime * 1.2 + i) * 3;
    const sh = 11 + (i % 2) * 8;
    fill(244, 239, 222, 42);
    rect(sx, 164, 6, sh);
  }

  fill(245, 233, 208);
  textSize(23);
  textAlign("center");
  text("おでんの限界", GAME_W / 2, 239);

  fill(190, 196, 205);
  textSize(9);
  text("お椀がこぼれる前に、蓋をする。", GAME_W / 2, 219);
  text("大将の鍋より、ぎりぎり深く。", GAME_W / 2, 205);

  fill(245, 233, 208, 150 + Math.sin(ElapsedTime * 5) * 80);
  textSize(9);
  text("タップして、勝負する", GAME_W / 2, 56);
}
