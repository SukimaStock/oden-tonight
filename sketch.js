// ==========================================
// 今夜のおでん — 手札式おでんブラックジャック
// Complete rewrite: no patch layers / no prototype overrides
// ==========================================

const GAME_W = 180;
const GAME_H = 320;

const STATE = {
  TITLE: "TITLE",
  ARRIVAL: "ARRIVAL",
  SERVE: "SERVE",
  RESULT: "RESULT",
  DEPARTURE: "DEPARTURE",
  SUMMARY: "SUMMARY"
};

const BJ_TARGET = 21;
const HAND_SIZE = 3;
const DAILY_CUSTOMERS = 4;
const DAILY_POT_TARGET = 18;

const INGREDIENTS = [
  { id: "SHIRATAKI", name: "しらたき", value: 2, price: 90,  family: "LIGHT", visual: "shirataki" },
  { id: "KONNYAKU",  name: "こんにゃく", value: 3, price: 100, family: "LIGHT", visual: "konnyaku" },
  { id: "CHIKUWA",   name: "ちくわ", value: 4, price: 110, family: "LIGHT", visual: "chikuwa" },
  { id: "EGG",       name: "たまご", value: 5, price: 130, family: "WARM",  visual: "egg" },
  { id: "DAIKON",    name: "だいこん", value: 6, price: 120, family: "WARM",  visual: "daikon" },
  { id: "GANMODOKI", name: "がんも", value: 7, price: 150, family: "WARM",  visual: "ganmo" },
  { id: "MOCHI_POUCH", name: "餅巾着", value: 9, price: 190, family: "FEAST", visual: "mochi" },
  { id: "BEEF_TENDON", name: "牛すじ", value: 10, price: 220, family: "FEAST", visual: "beef" }
];

const CUSTOMER_DB = [
  {
    id: "SAEKI",
    name: "佐伯さん",
    visual: "office_worker",
    line: "終電まで、あと七分なんだ。\n冷えただけだから、すぐ食べられるものを",
    exact: "これで、ちょうど走れる。",
    high: "うん、これなら間に合いそう。",
    okay: "あったまった。助かったよ。",
    low: "おいしかったけど、もう少しいけたかな。",
    bust: "おいしいけど......今日は急いでいて。"
  },
  {
    id: "MINATO",
    name: "ミナトさん",
    visual: "regular_worker",
    line: "今日は軽くでいいよ。\n財布が、ちょっと冬みたいでさ",
    exact: "助かる。今日はこういうのがいいんだ。",
    high: "悪くないね。あったまる。",
    okay: "ちょうど小腹が落ち着いたよ。",
    low: "もう一つ、いけたかもな。",
    bust: "あはは......今日は財布も胃も追いつかないよ。"
  },
  {
    id: "TOYAMA",
    name: "遠山さん",
    visual: "happy_worker",
    line: "今日、少しだけいいことがあってね。\n帰る前に、ひとつ景気づけを",
    exact: "いいね。今日はこれくらい、許される。",
    high: "なんだか、少し落ち着いたよ。",
    okay: "悪くない。でも、まだ夜は長いな。",
    low: "今日はもう少し、景気よくいきたかったな。",
    bust: "いや、これはちょっと食べすぎたかも。"
  },
  {
    id: "NONOMURA",
    name: "野々村さん",
    visual: "inn_worker",
    line: "宴会が長くてね。\n胃に怒られないやつ、ある?",
    exact: "これなら、胃も文句を言わない。",
    high: "うん、今日はこれくらいがいい。",
    okay: "だしが、ちゃんとしみるね。",
    low: "少し物足りないけど、今夜は我慢かな。",
    bust: "店主さん、今日はもう許して。"
  },
  {
    id: "YUKI",
    name: "ユキさん",
    visual: "tourist",
    line: "温泉、すごくよかったです。\nこの町らしいものを食べたくて",
    exact: "ああ、これを食べに来た感じがします。",
    high: "おいしいです。あったまりますね。",
    okay: "この町の夜って、いいですね。",
    low: "もう少し食べてみたかったです。",
    bust: "おいしいけれど、ちょっと多かったですね。"
  },
  {
    id: "KOTA",
    name: "コウタ",
    visual: "student",
    line: "雨、全然やまないなあ。\n小腹だけ、なんとかしたいです",
    exact: "これ、ちょうどいいです。",
    high: "あったまります。助かる。",
    okay: "小腹は、なんとか落ち着きました。",
    low: "もう一つ、いけたかもです。",
    bust: "えっ、そんなに食べられないですって。"
  }
];

const NIGHT_CONTEXTS = [
  { id: "RAIN",  label: "雨の夜",     intro: "雨音が、屋台の屋根を細く叩いている。" },
  { id: "COLD",  label: "冷える夜",   intro: "吐く息が白く、だしの湯気が濃い。" },
  { id: "BUSY",  label: "にぎやかな夜", intro: "温泉帰りの人影が、通りを流れている。" },
  { id: "QUIET", label: "静かな夜",   intro: "提灯だけが、ゆっくり揺れている。" }
];

const PALETTE = {
  " ": null,
  "W": { r: 240, g: 240, b: 240 }, "w": { r: 200, g: 200, b: 200 },
  "Y": { r: 240, g: 200, b: 80 },  "y": { r: 200, g: 160, b: 60 },
  "B": { r: 140, g: 80, b: 50 },   "b": { r: 100, g: 50, b: 30 },
  "G": { r: 120, g: 130, b: 130 }, "g": { r: 90, g: 100, b: 100 },
  "O": { r: 220, g: 150, b: 80 },  "o": { r: 180, g: 110, b: 50 },
  "L": { r: 250, g: 230, b: 180 }, "l": { r: 220, g: 190, b: 140 },
  "C": { r: 230, g: 180, b: 100 }, "c": { r: 120, g: 70, b: 40 },
  "S": { r: 200, g: 220, b: 220 }, "s": { r: 160, g: 180, b: 180 }
};

const ART = {
  daikon:    [" WWWW ", "WWWWWW", "WWWWWW", " wwww ", " wwww ", "  ww  "],
  egg:       ["  YY  ", " YYYY ", "YYYYYY", "yyyyyy", " yyyy ", "  yy  "],
  beef:      ["  b   ", " bBb  ", " bBbb ", "bbBBbb", "  b   ", "  b   "],
  konnyaku:  ["  GG  ", " GGGG ", "GGGGGG", "gggggg", " gggg ", "  gg  "],
  ganmo:     [" OOOO ", "OOOOOO", "oOOOOo", "oooooo", " oooo ", "  oo  "],
  mochi:     ["  ll  ", " LLLL ", "LLLLLL", "llllll", " llll ", "  ll  "],
  chikuwa:   [" CCcc ", "CCCCCC", "CCCCCC", "cccccc", " cccc ", "  cc  "],
  shirataki: ["  SS  ", " SSSS ", "sSSsSS", "ssssss", " ssss ", "  ss  "]
};

let scaleFactor = 1;
let offsetX = 0;
let offsetY = 0;
let inputLockUntil = 0;
let model = null;

// ==========================================
// Model
// ==========================================
class GameModel {
  constructor() {
    this.resetGame();
  }

  resetGame() {
    this.state = STATE.TITLE;
    this.day = 1;
    this.totalSales = 0;
    this.totalExact = 0;
    this.shopMood = 0;

    this.sales = 0;
    this.dailyExact = 0;
    this.satisfaction = 0;
    this.soldCounts = {};

    this.night = null;
    this.lastNightId = "";

    this.customers = [];
    this.currentIndex = 0;
    this.currentCustomer = null;
    this.message = "";

    this.potDeck = [];
    this.hand = [null, null, null];
    this.served = [];
    this.total = 0;

    this.animT = 0;
    this.customerX = GAME_W + 40;

    this.dayClosingLine = "";
    this.tomorrowHint = "";
  }

  startNewRun() {
    this.resetGame();
    this.startDay();
    this.nextCustomer();
  }

  startNextDay() {
    this.day += 1;
    this.startDay();
    this.nextCustomer();
  }

  startDay() {
    this.sales = 0;
    this.dailyExact = 0;
    this.satisfaction = 0;
    this.soldCounts = {};
    this.currentIndex = 0;
    this.currentCustomer = null;
    this.message = "";
    this.served = [];
    this.total = 0;

    this.returnHandToPot();
    this.restockPot();
    this.refillHand();

    this.night = this.pickNight();
    this.customers = shuffleCopy(CUSTOMER_DB).slice(0, DAILY_CUSTOMERS);
  }

  pickNight() {
    let candidates = NIGHT_CONTEXTS.filter(night => night.id !== this.lastNightId);

    if (candidates.length === 0) {
      candidates = NIGHT_CONTEXTS;
    }

    const night = candidates[Math.floor(Math.random() * candidates.length)];
    this.lastNightId = night.id;
    return night;
  }

  returnHandToPot() {
    for (const dish of this.hand || []) {
      if (dish) this.potDeck.push(dish);
    }

    this.hand = [null, null, null];
  }

  restockPot() {
    while (this.potDeck.length < DAILY_POT_TARGET) {
      this.potDeck.push(makeRandomPotDish());
    }
  }

  refillHand() {
    for (let i = 0; i < HAND_SIZE; i++) {
      if (!this.hand[i]) {
        this.hand[i] = this.drawFromPot();
      }
    }
  }

  drawFromPot() {
    if (this.potDeck.length === 0) return null;

    const index = Math.floor(Math.random() * this.potDeck.length);
    return this.potDeck.splice(index, 1)[0];
  }

  nextCustomer() {
    if (this.currentIndex >= this.customers.length) {
      this.finishDay();
      return;
    }

    if (!this.hasAnyStock()) {
      this.finishDay();
      return;
    }

    this.currentCustomer = this.customers[this.currentIndex];
    this.served = [];
    this.total = 0;
    this.message = this.currentCustomer.line;
    this.state = STATE.ARRIVAL;
    this.animT = 0;
    this.customerX = GAME_W + 40;
  }

  hasAnyStock() {
    return this.potDeck.length > 0 || this.hand.some(dish => dish);
  }

  handDish(index) {
    return this.hand[index] || null;
  }

  serveFromHand(index) {
    const dish = this.handDish(index);
    if (!dish) return;

    this.hand[index] = null;
    this.serveDish(dish, "HAND");
  }

  gambleFromPot() {
    const dish = this.drawFromPot();

    if (!dish) {
      this.message = "鍋の底が見えている。\n今日はここで、会計にしよう。";
      this.state = STATE.SERVE;
      return;
    }

    this.serveDish(dish, "POT");
  }

  serveDish(dish, source) {
    if (!dish || this.state === STATE.RESULT) return;

    this.served.push({ dish: dish, source: source });
    this.total += dish.value;
    this.sales += dish.price;
    this.totalSales += dish.price;
    this.soldCounts[dish.name] = (this.soldCounts[dish.name] || 0) + 1;

    if (this.total >= BJ_TARGET) {
      this.resolveCustomer();
      return;
    }

    this.message =
      `${dish.name}を、小皿によそった。\n` +
      `いま ${this.total} / ${BJ_TARGET}。どうする?`;

    this.state = STATE.SERVE;
  }

  stand() {
    if (this.served.length === 0) return;
    this.resolveCustomer();
  }

  resolveCustomer() {
    const customer = this.currentCustomer;
    let scoreChange = 0;

    if (this.total > BJ_TARGET) {
      scoreChange = -2;
      this.message = `${customer.name}は箸を置いた。\n「${this.total}は、ちょっと食べすぎたかも」`;
    } else if (this.total === BJ_TARGET) {
      scoreChange = 3;
      this.dailyExact += 1;
      this.totalExact += 1;
      this.message = `${customer.name}が、小さく笑った。\n「${customer.exact}」`;
    } else if (this.total >= 18) {
      scoreChange = 2;
      this.message = `${customer.name}は湯気を見つめた。\n「${customer.high}」`;
    } else if (this.total >= 14) {
      scoreChange = 1;
      this.message = `${customer.name}は、ゆっくり席を立った。\n「${customer.okay}」`;
    } else {
      scoreChange = -1;
      this.message = `${customer.name}は少し迷ってから立ち上がった。\n「${customer.low}」`;
    }

    this.satisfaction += scoreChange;
    this.shopMood = clamp(this.shopMood + scoreChange, -20, 30);
    this.state = STATE.RESULT;
  }

  depart() {
    this.state = STATE.DEPARTURE;
    this.animT = 0;
  }

  finishDay() {
    if (this.dailyExact >= 2) {
      this.dayClosingLine = "今夜は、ちょうどいい湯気が\n何度も横丁に残った。";
    } else if (this.dailyExact === 1) {
      this.dayClosingLine = "一人ぶんの「ちょうど」が、\n提灯の下に残っている。";
    } else if (this.satisfaction <= -3) {
      this.dayClosingLine = "今夜は少し、よそいすぎた。\n鍋の湯気だけが、まだ元気だ。";
    } else if (this.sales >= 1000) {
      this.dayClosingLine = "よく売れた夜だった。\n鍋の底が、ゆっくり見えている。";
    } else {
      this.dayClosingLine = "今夜の鍋は、\n静かにだしを残している。";
    }

    this.tomorrowHint =
      `明日の仕込み前:残り ${this.totalStock()}品\n` +
      "朝の鍋に、また少し具が足される。";

    this.state = STATE.SUMMARY;
  }

  totalStock() {
    return this.potDeck.length + this.hand.filter(dish => dish).length;
  }

  familyCounts() {
    const counts = { light: 0, warm: 0, feast: 0 };

    for (const dish of this.potDeck) {
      if (dish.family === "LIGHT") counts.light += 1;
      else if (dish.family === "WARM") counts.warm += 1;
      else counts.feast += 1;
    }

    return counts;
  }
}

// ==========================================
// Game setup / input
// ==========================================
function setup() {
  model = new GameModel();
  resized();
}

function resized() {
  const sx = WIDTH / GAME_W;
  const sy = HEIGHT / GAME_H;
  scaleFactor = Math.min(sx, sy);
  offsetX = (WIDTH - GAME_W * scaleFactor) / 2;
  offsetY = (HEIGHT - GAME_H * scaleFactor) / 2;
}

function touched(touch) {
  if (ElapsedTime < inputLockUntil) return;
  if (touch.state !== ENDED) return;

  const x = (touch.x - offsetX) / scaleFactor;
  const y = (touch.y - offsetY) / scaleFactor;

  if (x < 0 || x > GAME_W || y < 0 || y > GAME_H) return;
  handleTap(x, y);
}

function lockInput() {
  inputLockUntil = ElapsedTime + 0.18;
}

function handleTap(x, y) {
  if (model.state === STATE.TITLE) {
    model.startNewRun();
    lockInput();
    return;
  }

  if (model.state === STATE.ARRIVAL) {
    if (model.animT > 0.25) model.animT = 1;
    return;
  }

  if (model.state === STATE.SERVE) {
    for (let i = 0; i < HAND_SIZE; i++) {
      const slot = handSlotRect(i);
      if (model.handDish(i) && inside(x, y, slot.x, slot.y, slot.w, slot.h)) {
        model.serveFromHand(i);
        lockInput();
        return;
      }
    }

    if (model.served.length > 0) {
      const stand = standRect();
      if (inside(x, y, stand.x, stand.y, stand.w, stand.h)) {
        model.stand();
        lockInput();
        return;
      }
    }

    const gamble = gambleRect(model.served.length === 0);
    if (model.potDeck.length > 0 && inside(x, y, gamble.x, gamble.y, gamble.w, gamble.h)) {
      model.gambleFromPot();
      lockInput();
    }
    return;
  }

  if (model.state === STATE.RESULT) {
    model.depart();
    lockInput();
    return;
  }

  if (model.state === STATE.DEPARTURE) {
    if (model.animT > 0.25) model.animT = 1;
    return;
  }

  if (model.state === STATE.SUMMARY) {
    const next = nextDayRect();
    if (inside(x, y, next.x, next.y, next.w, next.h)) {
      model.startNextDay();
      lockInput();
    }
  }
}

function updateGame() {
  if (model.state !== STATE.ARRIVAL && model.state !== STATE.DEPARTURE) return;

  model.animT = Math.min(1, model.animT + DeltaTime * 1.6);

  if (model.state === STATE.ARRIVAL) {
    model.customerX = lerp(GAME_W + 38, 140, easeOut(model.animT));

    if (model.animT >= 1) {
      model.state = STATE.SERVE;
    }
    return;
  }

  model.customerX = lerp(140, -38, easeIn(model.animT));

  if (model.animT >= 1) {
    model.refillHand();
    model.currentIndex += 1;
    model.nextCustomer();
  }
}

// ==========================================
// Layout helpers
// ==========================================
function handSlotRect(index) {
  return { x: 10 + index * 54, y: 32, w: 52, h: 31 };
}

function standRect() {
  return { x: 10, y: 7, w: 76, h: 18 };
}

function gambleRect(firstServe) {
  if (firstServe) return { x: 30, y: 7, w: 120, h: 18 };
  return { x: 94, y: 7, w: 76, h: 18 };
}

function nextDayRect() {
  return { x: 33, y: 40, w: 114, h: 28 };
}

function inside(x, y, rx, ry, rw, rh) {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOut(t) {
  return t * (2 - t);
}

function easeIn(t) {
  return t * t;
}

function shuffleCopy(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function makeRandomPotDish() {
  const roll = Math.random();

  if (roll < 0.26) return randomIngredientByFamily("LIGHT");
  if (roll < 0.74) return randomIngredientByFamily("WARM");
  return randomIngredientByFamily("FEAST");
}

function randomIngredientByFamily(family) {
  const candidates = INGREDIENTS.filter(item => item.family === family);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ==========================================
// Rendering
// ==========================================
function draw() {
  background(17, 19, 29);

  pushMatrix();
  translate(offsetX, offsetY);
  scale(scaleFactor, scaleFactor);
  pushClip(0, 0, GAME_W, GAME_H);

  updateGame();

  if (model.state === STATE.TITLE) {
    drawTitle();
  } else {
    drawBackground();
    drawCustomer();
    drawStall();
    drawGameUI();

    if (model.state === STATE.SUMMARY) {
      drawSummary();
    }
  }

  popClip();
  popMatrix();
}

// ==========================================
// Scene
// ==========================================
function drawBackground() {
  rectMode(CORNER);
  noStroke();

  fill(18, 22, 33);
  rect(0, 0, GAME_W, GAME_H);

  fill(27, 33, 47);
  rect(0, 176, GAME_W, 116);

  fill(37, 43, 57);
  rect(0, 184, 27, 70);
  rect(31, 184, 29, 92);
  rect(64, 184, 22, 62);
  rect(91, 184, 34, 84);
  rect(130, 184, 25, 60);
  rect(158, 184, 22, 94);

  const glow = 112 + Math.sin(ElapsedTime * 1.2) * 12;
  fill(224, 181, 96, glow);
  rect(10, 211, 6, 10);
  rect(40, 231, 7, 11);
  rect(69, 204, 6, 10);
  rect(99, 221, 7, 13);
  rect(116, 201, 6, 9);
  rect(143, 215, 6, 12);
  rect(166, 229, 7, 11);

  fill(27, 29, 38);
  rect(0, 0, GAME_W, 184);

  fill(62, 52, 44, 76);
  rect(0, 173, GAME_W, 4);

  stroke(127, 141, 156, 42);
  strokeWidth(1);

  for (let i = 0; i < 10; i++) {
    const px = 8 + i * 19;
    const py = 18 + ((i * 23) % 132);
    line(px, py, px + 9, py + 2);
  }

  noStroke();
}

function drawStall() {
  rectMode(CORNER);
  noStroke();

  fill(46, 33, 32);
  rect(8, 206, 118, 62);

  fill(68, 45, 39);
  rect(12, 210, 110, 54);

  fill(122, 57, 47);
  rect(16, 225, 45, 29);
  rect(63, 225, 45, 29);
  rect(110, 225, 8, 29);

  fill(239, 221, 184);
  rect(22, 232, 32, 14);

  fill(86, 47, 40);
  textSize(8);
  textAlign("center");
  text("おでん", 38, 235);

  fill(82, 53, 40);
  rect(5, 178, GAME_W - 10, 9);

  fill(127, 80, 53);
  rect(5, 187, GAME_W - 10, 4);

  fill(72, 46, 37);
  rect(10, 191, GAME_W - 20, 20);

  fill(52, 57, 65);
  rect(18, 196, 112, 31);

  fill(107, 112, 117);
  rect(21, 199, 106, 25);

  fill(48, 50, 55);
  rect(24, 202, 100, 18);

  fill(203, 145, 69);
  rect(26, 204, 96, 14);

  fill(255, 219, 145, 10 + Math.sin(ElapsedTime * 2) * 3);
  rect(26, 214, 96, 3);

  fill(91, 96, 101);
  rect(49, 202, 3, 18);
  rect(75, 202, 3, 18);
  rect(101, 202, 3, 18);

  drawPixelArt(31, 205, ART.daikon, 2);
  drawPixelArt(57, 205, ART.egg, 2);
  drawPixelArt(83, 205, ART.ganmo, 2);
  drawPixelArt(109, 205, ART.chikuwa, 2);

  const swing = Math.sin(ElapsedTime * 1.6) * 3;
  pushMatrix();
  translate(171, 258);
  rotate(swing);
  rectMode(CENTER);

  fill(113, 45, 42);
  rect(0, 0, 18, 33);
  fill(188, 71, 59);
  rect(0, 0, 13, 27);
  fill(243, 219, 177);
  rect(0, 7, 9, 2);

  fill(50, 32, 29);
  textSize(6);
  textAlign("center");
  text("お", 0, 10);
  text("で", 0, 3);
  text("ん", 0, -4);

  popMatrix();
  rectMode(CORNER);

  fill(244, 240, 226, 30);
  const steam = Math.sin(ElapsedTime * 1.2) * 3;
  rect(36, 229 + steam, 8, 15);
  rect(70, 232 - steam, 10, 17);
  rect(104, 228 + steam * 0.7, 8, 18);
}

function drawCustomer() {
  if (!model.currentCustomer) return;

  const x = model.customerX;
  const y = 183;
  const customer = model.currentCustomer;

  let coat = { r: 58, g: 70, b: 83 };
  let hair = { r: 42, g: 37, b: 35 };
  let accent = { r: 118, g: 132, b: 144 };

  if (customer.visual === "regular_worker") {
    coat = { r: 91, g: 68, b: 53 };
    accent = { r: 170, g: 134, b: 85 };
  } else if (customer.visual === "happy_worker") {
    coat = { r: 92, g: 65, b: 62 };
    accent = { r: 205, g: 134, b: 83 };
  } else if (customer.visual === "inn_worker") {
    coat = { r: 59, g: 81, b: 71 };
    hair = { r: 54, g: 44, b: 37 };
    accent = { r: 198, g: 178, b: 135 };
  } else if (customer.visual === "tourist") {
    coat = { r: 89, g: 113, b: 132 };
    hair = { r: 108, g: 78, b: 50 };
    accent = { r: 216, g: 187, b: 116 };
  } else if (customer.visual === "student") {
    coat = { r: 72, g: 87, b: 117 };
    hair = { r: 34, g: 35, b: 42 };
    accent = { r: 190, g: 198, b: 209 };
  }

  fill(10, 13, 19, 110);
  rect(x - 17, y, 34, 4);

  fill(coat.r, coat.g, coat.b);
  rect(x - 14, y + 3, 28, 37);

  fill(accent.r, accent.g, accent.b);
  rect(x - 5, y + 34, 10, 8);

  if (customer.visual === "tourist") {
    fill(126, 83, 48);
    rect(x + 11, y + 10, 8, 14);
    fill(215, 192, 148);
    rect(x + 12, y + 17, 6, 4);
  } else if (customer.visual === "office_worker" || customer.visual === "inn_worker") {
    fill(39, 42, 48);
    rect(x - 20, y + 10, 7, 14);
  } else if (customer.visual === "student") {
    fill(42, 52, 73);
    rect(x - 20, y + 10, 7, 15);
  }

  fill(231, 196, 166);
  rect(x - 10, y + 40, 20, 22);

  fill(hair.r, hair.g, hair.b);
  rect(x - 11, y + 57, 22, 7);
  rect(x - 11, y + 50, 4, 10);

  fill(35, 31, 31);
  rect(x - 5, y + 51, 2, 2);
  rect(x + 3, y + 51, 2, 2);

  const isHappy = model.state === STATE.RESULT && model.total >= 18 && model.total <= BJ_TARGET;
  if (isHappy) {
    rect(x - 3, y + 45, 6, 2);
  } else if (model.state === STATE.RESULT && model.total > BJ_TARGET) {
    rect(x - 3, y + 46, 6, 2);
  } else {
    rect(x - 2, y + 45, 4, 1);
  }

  if (customer.visual === "student") {
    noFill();
    stroke(119, 139, 174);
    strokeWidth(2);
    rect(x - 14, y + 42, 28, 25);
    noStroke();
  }
}

// ==========================================
// UI
// ==========================================
function drawGameUI() {
  drawHeader();
  drawDialogue();
  drawPlatePanel();
  drawHandPanel();

  if (model.state === STATE.RESULT) {
    drawTapToContinue();
  }
}

function drawHeader() {
  rectMode(CORNER);
  noStroke();

  fill(11, 14, 22, 242);
  rect(0, 292, GAME_W, 28);

  fill(95, 71, 56);
  rect(0, 292, GAME_W, 2);

  fill(241, 230, 203);
  textSize(10);
  textAlign("left");
  text("今夜のおでん", 8, 303);

  fill(182, 190, 204);
  textSize(8);
  textAlign("center");
  text(`第${model.day}夜 ${model.currentIndex + 1}/${model.customers.length}人目`, GAME_W / 2, 303);

  fill(241, 230, 203);
  textSize(10);
  textAlign("right");
  text(`¥ ${model.sales}`, GAME_W - 8, 303);

  fill(151, 160, 177);
  textSize(8);
  textAlign("left");
  text(`ぴったり ${model.dailyExact} 残り ${model.totalStock()}品`, 8, 281);

  textAlign("right");
  text(model.night ? model.night.label : "横丁の夜", GAME_W - 8, 281);
}

function drawDialogue() {
  if (!model.message || model.state === STATE.SUMMARY) return;

  fill(17, 21, 29, 238);
  rect(9, 132, 162, 41);
  fill(95, 71, 56);
  rect(9, 132, 162, 3);

  let speaker = model.currentCustomer ? model.currentCustomer.name : "店主";
  if (model.state === STATE.RESULT && model.total === 0) speaker = "店主";

  fill(239, 218, 185);
  textSize(9);
  textAlign("left");
  text(speaker, 17, 160);

  fill(211, 214, 219);
  textSize(9);
  drawSplitText(model.message, 17, 143, 18, 10);
}

function drawPlatePanel() {
  const total = model.total;
  const served = model.served;

  fill(17, 21, 29, 238);
  rect(9, 104, 162, 24);
  fill(95, 71, 56);
  rect(9, 125, 162, 2);

  fill(239, 218, 185);
  textSize(8);
  textAlign("left");
  text(`小皿 ${total} / ${BJ_TARGET}`, 16, 117);

  const barX = 75;
  const barY = 114;
  const barW = 82;
  const barH = 6;

  fill(61, 64, 69);
  rect(barX, barY, barW, barH);

  const safe = Math.min(total, BJ_TARGET);
  const fillW = (safe / BJ_TARGET) * barW;

  if (total > BJ_TARGET) fill(170, 65, 52);
  else if (total === BJ_TARGET) fill(221, 180, 86);
  else fill(181, 130, 72);

  rect(barX, barY, fillW, barH);

  if (total > BJ_TARGET) {
    fill(241, 204, 184);
    textSize(6);
    textAlign("right");
    text("食べすぎ", 164, 117);
  } else if (total === BJ_TARGET) {
    fill(255, 236, 183);
    textSize(6);
    textAlign("right");
    text("ぴったり", 164, 117);
  }

  let x = 16;
  for (let i = 0; i < served.length && i < 5; i++) {
    const dish = served[i].dish;
    fill(224, 211, 184);
    rect(x, 106, 27, 6);
    drawPixelArt(x + 1, 107, ART[dish.visual], 1);
    fill(72, 49, 37);
    textSize(5);
    textAlign("right");
    text(`+${dish.value}`, x + 25, 107);
    x += 30;
  }

  if (served.length === 0) {
    fill(196, 200, 205);
    textSize(6);
    textAlign("left");
    text("まだ、小皿は空いている", 16, 107);
  } else if (served.length > 5) {
    fill(196, 200, 205);
    textSize(6);
    textAlign("right");
    text(`+${served.length - 5}`, 165, 107);
  }
}

function drawHandPanel() {
  fill(54, 58, 62);
  rect(7, 4, 166, 97);
  fill(102, 106, 108);
  rect(10, 7, 160, 91);
  fill(53, 49, 43);
  rect(13, 10, 154, 85);
  fill(199, 142, 66);
  rect(16, 13, 148, 79);
  fill(238, 188, 101, 22);
  rect(16, 13, 148, 79);

  fill(245, 231, 202);
  textSize(8);
  textAlign("left");
  text("仕込み台", 18, 84);

  fill(231, 213, 175);
  textSize(6);
  textAlign("right");
  text("出せる具を選ぶ", 162, 84);

  for (let i = 0; i < HAND_SIZE; i++) {
    drawHandCard(i);
  }

  const family = model.familyCounts();
  fill(73, 49, 36);
  textSize(7);
  textAlign("left");
  text(`鍋の残り ${model.potDeck.length}品`, 18, 74);

  fill(119, 83, 53);
  textSize(6);
  text(`軽 ${family.light} しみる ${family.warm} 景気 ${family.feast}`, 18, 66);

  drawActions();
}

function drawHandCard(index) {
  const slot = handSlotRect(index);
  const dish = model.handDish(index);

  fill(73, 66, 57);
  rect(slot.x - 1, slot.y - 1, slot.w + 2, slot.h + 2);

  if (!dish) {
    fill(106, 89, 64);
    rect(slot.x, slot.y, slot.w, slot.h);

    fill(232, 203, 143, 110);
    textSize(7);
    textAlign("center");
    text("空き", slot.x + slot.w / 2, slot.y + 12);
    return;
  }

  fill(224, 169, 85);
  rect(slot.x, slot.y, slot.w, slot.h);
  fill(255, 224, 157, 34);
  rect(slot.x + 2, slot.y + 2, slot.w - 4, slot.h - 4);

  drawPixelArt(slot.x + 4, slot.y + 11, ART[dish.visual], 2);

  fill(74, 49, 36);
  textSize(7);
  textAlign("left");
  text(dish.name, slot.x + 20, slot.y + 18);

  fill(126, 63, 45);
  textSize(7);
  textAlign("right");
  text(`+${dish.value}`, slot.x + slot.w - 4, slot.y + 7);

  fill(107, 72, 48);
  textSize(5);
  textAlign("right");
  text(`¥${dish.price}`, slot.x + slot.w - 4, slot.y + 14);
}

function drawActions() {
  if (model.state !== STATE.SERVE) {
    fill(119, 83, 53);
    textSize(6);
    textAlign("center");
    text(model.state === STATE.RESULT ? "客の返事を待つ" : "", GAME_W / 2, 13);
    return;
  }

  if (model.served.length > 0) {
    const stand = standRect();
    fill(72, 51, 39);
    rect(stand.x, stand.y, stand.w, stand.h);
    fill(229, 216, 188);
    rect(stand.x + 2, stand.y + 2, stand.w - 4, stand.h - 4);
    fill(76, 51, 40);
    textSize(8);
    textAlign("center");
    text("会計にする", stand.x + stand.w / 2, 13);
  }

  const first = model.served.length === 0;
  const gamble = gambleRect(first);
  const enabled = model.potDeck.length > 0;

  fill(enabled ? 111 : 83, enabled ? 61 : 63, enabled ? 43 : 50);
  rect(gamble.x, gamble.y, gamble.w, gamble.h);

  fill(enabled ? 206 : 133, enabled ? 130 : 105, enabled ? 77 : 76);
  rect(gamble.x + 2, gamble.y + 2, gamble.w - 4, gamble.h - 4);

  fill(255, 243, 217);
  textSize(first ? 8 : 7);
  textAlign("center");
  text(enabled ? (first ? "鍋から直接すくう ?" : "鍋から賭ける ?") : "鍋が空", gamble.x + gamble.w / 2, 13);
}

function drawTapToContinue() {
  fill(245, 231, 203, 150 + Math.sin(ElapsedTime * 5) * 45);
  textSize(9);
  textAlign("center");
  text("タップして続ける ›", GAME_W / 2, 20);
}

// ==========================================
// Title / summary
// ==========================================
function drawTitle() {
  rectMode(CORNER);
  noStroke();

  fill(18, 22, 33);
  rect(0, 0, GAME_W, GAME_H);

  fill(28, 34, 47);
  rect(0, 190, GAME_W, 130);

  fill(37, 43, 57);
  rect(0, 197, 34, 78);
  rect(42, 197, 28, 96);
  rect(79, 197, 36, 70);
  rect(124, 197, 25, 93);
  rect(156, 197, 24, 72);

  fill(27, 29, 38);
  rect(0, 0, GAME_W, 191);

  fill(48, 34, 32);
  rect(27, 101, 126, 66);
  fill(68, 45, 39);
  rect(31, 105, 118, 58);
  fill(122, 57, 47);
  rect(35, 123, 47, 30);
  rect(84, 123, 47, 30);

  fill(55, 58, 66);
  rect(30, 166, 121, 29);
  fill(207, 150, 71);
  rect(34, 170, 113, 17);

  drawPixelArt(48, 172, ART.daikon, 2);
  drawPixelArt(83, 172, ART.egg, 2);
  drawPixelArt(117, 172, ART.ganmo, 2);

  const swing = Math.sin(ElapsedTime * 1.7) * 3;
  pushMatrix();
  translate(151, 207);
  rotate(swing);
  rectMode(CENTER);

  fill(122, 48, 43);
  rect(0, 0, 25, 38);
  fill(190, 70, 59);
  rect(0, 0, 18, 32);
  fill(240, 220, 180);
  textSize(8);
  textAlign("center");
  text("おでん", 0, -3);

  popMatrix();
  rectMode(CORNER);

  fill(245, 233, 207);
  textSize(24);
  textAlign("center");
  text("今夜のおでん", GAME_W / 2, 252);

  fill(189, 194, 204);
  textSize(9);
  text("客の胃袋は、みんな21。", GAME_W / 2, 234);
  text("手元の具を出すか、鍋に賭けるか。", GAME_W / 2, 220);

  fill(245, 233, 207, 150 + Math.sin(ElapsedTime * 5) * 90);
  textSize(9);
  text("タップして、のれんを出す", GAME_W / 2, 58);
}

function drawSummary() {
  rectMode(CORNER);
  noStroke();

  fill(7, 10, 16, 204);
  rect(0, 0, GAME_W, GAME_H);

  fill(67, 47, 38);
  rect(13, 27, 154, 260);
  fill(234, 220, 190);
  rect(16, 30, 148, 254);
  fill(246, 237, 214);
  rect(20, 34, 140, 246);

  fill(76, 52, 40);
  textSize(14);
  textAlign("center");
  text(`第${model.day}夜のしめ`, GAME_W / 2, 255);

  fill(127, 82, 57);
  textSize(8);
  text(model.night ? model.night.label : "", GAME_W / 2, 239);

  fill(76, 52, 40);
  textSize(10);
  textAlign("left");
  text(`今夜の売上: ¥${model.sales}`, 34, 218);
  text(`累計売上: ¥${model.totalSales}`, 34, 201);
  text(`21ぴったり: ${model.dailyExact}人`, 34, 184);
  text(`残った具: ${model.totalStock()}品`, 34, 167);

  fill(127, 82, 57);
  textSize(10);
  drawSplitText(model.dayClosingLine, 34, 123, 15, 13);

  fill(103, 74, 57);
  textSize(8);
  drawSplitText(model.tomorrowHint, 34, 77, 17, 10);

  const next = nextDayRect();
  fill(116, 61, 43);
  rect(next.x, next.y, next.w, next.h);

  fill(255, 241, 214);
  textAlign("center");
  textSize(9);
  text("明日のれんを出す", GAME_W / 2, 50);
}

// ==========================================
// Generic drawing helpers
// ==========================================
function drawPixelArt(px, py, dataArray, size) {
  if (!dataArray) return;

  noStroke();
  for (let r = 0; r < dataArray.length; r++) {
    const row = dataArray[r];

    for (let c = 0; c < row.length; c++) {
      const colorData = PALETTE[row[c]];
      if (!colorData) continue;

      fill(colorData.r, colorData.g, colorData.b);
      rect(px + c * size, py + (dataArray.length - 1 - r) * size, size, size);
    }
  }
}

function drawSplitText(str, x, y, maxLen, lineHeight) {
  const lines = [];
  const rawLines = String(str || "").split("\n");

  for (const raw of rawLines) {
    let line = "";
    for (let i = 0; i < raw.length; i++) {
      line += raw[i];
      if (line.length >= maxLen) {
        lines.push(line);
        line = "";
      }
    }
    if (line.length > 0) lines.push(line);
  }

  textAlign("left");
  let cy = y;
  for (let i = lines.length - 1; i >= 0; i--) {
    text(lines[i], x, cy);
    cy += lineHeight;
  }
}
