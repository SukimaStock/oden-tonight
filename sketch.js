// ==========================================
// Constants & Game Data
// ==========================================
const GAME_W = 320;
const GAME_H = 180;

const STATE = {
  TITLE: "TITLE",
  ARRIVAL: "ARRIVAL",
  FIRST_CHOICE: "FIRST_CHOICE",
  FIRST_RESULT: "FIRST_RESULT",
  SECOND_DECISION: "SECOND_DECISION",
  SECOND_CHOICE: "SECOND_CHOICE",
  SECOND_RESULT: "SECOND_RESULT",
  DEPARTURE: "DEPARTURE",
  SUMMARY: "SUMMARY"
};

const INGREDIENTS = [
  { id: "DAIKON", name: "だいこん", price: 120, shortDesc: "しみる、やさしい", visual: "daikon" },
  { id: "EGG", name: "たまご", price: 130, shortDesc: "少し元気が出る", visual: "egg" },
  { id: "BEEF_TENDON", name: "牛すじ", price: 220, shortDesc: "濃くて満たされる", visual: "beef" },
  { id: "KONNYAKU", name: "こんにゃく", price: 100, shortDesc: "軽く、気楽に", visual: "konnyaku" },
  { id: "GANMODOKI", name: "がんも", price: 150, shortDesc: "だしを楽しむ", visual: "ganmo" },
  { id: "MOCHI_POUCH", name: "餅巾着", price: 190, shortDesc: "今日はちょっと特別", visual: "mochi" },
  { id: "CHIKUWA", name: "ちくわ", price: 110, shortDesc: "気軽な小腹みたし", visual: "chikuwa" },
  { id: "SHIRATAKI", name: "しらたき", price: 90, shortDesc: "控えめ、軽やか", visual: "shirataki" }
];

const CUSTOMERS_DB = [
  {
    id: "SAEKI", name: "佐伯さん", visual: "office_worker",
    line: "終電まで、あと七分なんだ。\n冷えただけだから、すぐ食べられるものを",
    idealFirst: ["DAIKON", "KONNYAKU", "SHIRATAKI"],
    okayFirst: ["EGG", "CHIKUWA"],
    badFirst: ["BEEF_TENDON", "MOCHI_POUCH"],
    goodSecond: ["EGG", "CHIKUWA"],
    badSecond: ["MOCHI_POUCH", "BEEF_TENDON"],
    successLine: "これ、ちょうどよかった。",
    okayLine: "うん、これなら間に合いそう。",
    missLine: "おいしそうだけど……今日は急いでいて。",
    oversoldLine: "今日は、これくらいでよかったかも。"
  },
  {
    id: "MINATO", name: "ミナトさん", visual: "regular_worker",
    line: "今日は軽くでいいよ。\n財布が、ちょっと冬みたいでさ",
    idealFirst: ["KONNYAKU", "CHIKUWA", "SHIRATAKI"],
    okayFirst: ["DAIKON", "EGG"],
    badFirst: ["BEEF_TENDON", "MOCHI_POUCH"],
    goodSecond: ["DAIKON", "CHIKUWA"],
    badSecond: ["BEEF_TENDON", "MOCHI_POUCH"],
    successLine: "助かる。今日はこういうのでいいんだ。",
    okayLine: "悪くないね。あったまる。",
    missLine: "今日は、ちょっと贅沢すぎるかな。",
    oversoldLine: "あはは……今日は財布が追いつかないよ。"
  },
  {
    id: "TOYAMA", name: "遠山さん", visual: "happy_worker",
    line: "今日、少しだけいいことがあってね。\n帰る前に、ひとつ景気づけを",
    idealFirst: ["BEEF_TENDON", "EGG", "MOCHI_POUCH"],
    okayFirst: ["DAIKON", "GANMODOKI"],
    badFirst: ["SHIRATAKI", "KONNYAKU"],
    goodSecond: ["BEEF_TENDON", "MOCHI_POUCH", "EGG"],
    badSecond: ["SHIRATAKI", "KONNYAKU"],
    successLine: "いいね。今日はこれくらい、許される。",
    okayLine: "なんだか、少し落ち着いたよ。",
    missLine: "今日はもう少し、景気よくいきたかったな。",
    oversoldLine: "いや、これはちょっと食べすぎたかも。"
  },
  {
    id: "NONOMURA", name: "野々村さん", visual: "inn_worker",
    line: "宴会が長くてね。\n胃に怒られないやつ、ある？",
    idealFirst: ["DAIKON", "GANMODOKI", "SHIRATAKI"],
    okayFirst: ["KONNYAKU", "CHIKUWA"],
    badFirst: ["BEEF_TENDON", "MOCHI_POUCH"],
    goodSecond: ["DAIKON", "SHIRATAKI"],
    badSecond: ["BEEF_TENDON", "MOCHI_POUCH", "EGG"],
    successLine: "これなら、胃も文句を言わない。",
    okayLine: "うん、今日はこれくらいがいい。",
    missLine: "おいしそうなんだけどね。今夜は勘弁しておこう。",
    oversoldLine: "店主さん、今日はもう許して。"
  },
  {
    id: "YUKI", name: "ユキさん", visual: "tourist",
    line: "温泉、すごくよかったです。\nこの町らしいものを食べたくて",
    idealFirst: ["DAIKON", "GANMODOKI", "MOCHI_POUCH"],
    okayFirst: ["EGG", "BEEF_TENDON"],
    badFirst: ["SHIRATAKI"],
    goodSecond: ["MOCHI_POUCH", "EGG"],
    badSecond: ["SHIRATAKI", "KONNYAKU"],
    successLine: "ああ、これを食べに来た感じがします。",
    okayLine: "おいしいです。あったまりますね。",
    missLine: "悪くないけど、もう少し町らしいものがよかったかも。",
    oversoldLine: "おいしいけれど、ちょっと多かったですね。"
  },
  {
    id: "KOTA", name: "コウタ", visual: "student",
    line: "雨、全然やまないなあ。\n小腹だけ、なんとかしたいです",
    idealFirst: ["CHIKUWA", "EGG", "KONNYAKU"],
    okayFirst: ["DAIKON", "GANMODOKI"],
    badFirst: ["BEEF_TENDON", "MOCHI_POUCH"],
    goodSecond: ["CHIKUWA", "EGG"],
    badSecond: ["BEEF_TENDON", "MOCHI_POUCH"],
    successLine: "これ、ちょうどいいです。",
    okayLine: "あったまります。助かる。",
    missLine: "うーん、今日はもっと軽いのでよかったかも。",
    oversoldLine: "えっ、そんなに食べられないですって。"
  }
];

// ==========================================
// Pixel Art Data
// ==========================================
const PALETTE = {
  ' ': null,
  'W': {r:240, g:240, b:240}, 'w': {r:200, g:200, b:200},
  'Y': {r:240, g:200, b:80},  'y': {r:200, g:160, b:60},
  'B': {r:140, g:80, b:50},   'b': {r:100, g:50, b:30},
  'G': {r:120, g:130, b:130}, 'g': {r:90,  g:100, b:100},
  'O': {r:220, g:150, b:80},  'o': {r:180, g:110, b:50},
  'L': {r:250, g:230, b:180}, 'l': {r:220, g:190, b:140},
  'C': {r:230, g:180, b:100}, 'c': {r:120, g:70, b:40},
  'S': {r:200, g:220, b:220}, 's': {r:160, g:180, b:180},
  'P': {r:240, g:120, b:120}, 'p': {r:200, g:80, b:80},
  'D': {r:40,  g:40,  b:50},  'd': {r:20,  g:20,  b:30},
  'T': {r:120, g:90,  b:60},  'R': {r:200, g:60,  b:60}
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

// ==========================================
// Globals
// ==========================================
let scaleFactor = 1;
let offsetX = 0;
let offsetY = 0;
let inputLockTimer = 0;

class GameModel {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.state = STATE.TITLE;
    this.sales = 0;
    this.satisfaction = 0;
    this.regulars = 0;
    this.soldCounts = {};
    
    // Shuffle customers
    this.customers = [...CUSTOMERS_DB].sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    
    this.currentCustomer = null;
    this.options = [];
    this.secondOptions = [];
    this.message = "";
    
    this.animT = 0;
    this.customerX = GAME_W + 50;
    this.canSecond = false;
  }
  
  nextCustomer() {
    if (this.currentIndex >= this.customers.length) {
      this.state = STATE.SUMMARY;
      return;
    }
    this.currentCustomer = this.customers[this.currentIndex];
    this.message = this.currentCustomer.line;
    this.state = STATE.ARRIVAL;
    this.animT = 0;
    this.customerX = GAME_W + 50;
  }
  
  createFirstOptions() {
    const c = this.currentCustomer;
    let ideal = INGREDIENTS.filter(i => c.idealFirst.includes(i.id));
    let okay = INGREDIENTS.filter(i => c.okayFirst.includes(i.id));
    let bad = INGREDIENTS.filter(i => c.badFirst.includes(i.id));
    
    // Fallback if empty
    if(ideal.length === 0) ideal = [INGREDIENTS[0]];
    if(okay.length === 0) okay = [INGREDIENTS[1]];
    if(bad.length === 0) bad = [INGREDIENTS[2]];
    
    const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];
    
    this.options = [pickRandom(ideal), pickRandom(okay), pickRandom(bad)]
      .sort(() => Math.random() - 0.5);
  }
  
  resolveFirst(idx) {
    const dish = this.options[idx];
    const c = this.currentCustomer;
    
    this.soldCounts[dish.name] = (this.soldCounts[dish.name] || 0) + 1;
    
    if (c.idealFirst.includes(dish.id)) {
      this.sales += dish.price;
      this.satisfaction += 3;
      this.regulars += 1;
      this.message = c.successLine;
      this.state = STATE.FIRST_RESULT;
      this.canSecond = true;
    } else if (c.okayFirst.includes(dish.id)) {
      this.sales += dish.price;
      this.satisfaction += 1;
      this.message = c.okayLine;
      this.state = STATE.FIRST_RESULT;
      this.canSecond = true;
    } else {
      this.satisfaction -= 1;
      this.message = c.missLine;
      this.state = STATE.FIRST_RESULT;
      this.canSecond = false;
    }
  }
  
  createSecondOptions() {
    const c = this.currentCustomer;
    let good = INGREDIENTS.filter(i => c.goodSecond.includes(i.id));
    let bad = INGREDIENTS.filter(i => c.badSecond.includes(i.id));
    
    if(good.length === 0) good = [INGREDIENTS[0]];
    if(bad.length === 0) bad = [INGREDIENTS[2]];
    
    const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];
    this.secondOptions = [pickRandom(good), pickRandom(bad)].sort(() => Math.random() - 0.5);
  }
  
  resolveSecond(idx) {
    const dish = this.secondOptions[idx];
    const c = this.currentCustomer;
    
    this.soldCounts[dish.name] = (this.soldCounts[dish.name] || 0) + 1;
    this.sales += dish.price;
    
    if (c.goodSecond.includes(dish.id)) {
      this.satisfaction += 2;
      this.regulars += 1;
      this.message = "お代わり、ありがとうね。";
    } else if (c.badSecond.includes(dish.id)) {
      this.satisfaction -= 2;
      this.regulars = Math.max(0, this.regulars - 1);
      this.message = c.oversoldLine;
    } else {
      this.message = "はいよ、お待ちどうさま。";
    }
    this.state = STATE.SECOND_RESULT;
  }
  
  depart() {
    this.state = STATE.DEPARTURE;
    this.animT = 0;
  }
}

let model;

// ==========================================
// Codea Lite Hooks
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
  
  // Convert screen to logical coords
  const gx = (touch.x - offsetX) / scaleFactor;
  // Codea Lite Y is bottom-up
  const gy = (touch.y - offsetY) / scaleFactor;
  
  // Check bounds
  if (gx < 0 || gx > GAME_W || gy < 0 || gy > GAME_H) return;
  
  if (touch.state === ENDED) {
    handleTap(gx, gy);
  }
}

function lockInput() {
  inputLockTimer = ElapsedTime + 0.25;
}

function isInside(x, y, rx, ry, rw, rh) {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

// ==========================================
// Game Logic
// ==========================================
function handleTap(x, y) {
  switch (model.state) {
    case STATE.TITLE:
      model.reset();
      model.nextCustomer();
      lockInput();
      break;
      
    case STATE.ARRIVAL:
      // Skip animation
      if (model.animT > 0.3) {
        model.animT = 1;
      }
      break;
      
    case STATE.FIRST_CHOICE:
      for (let i = 0; i < 3; i++) {
        const cx = 20 + i * 95;
        const cy = 5;
        if (isInside(x, y, cx, cy, 90, 55)) {
          model.resolveFirst(i);
          lockInput();
          break;
        }
      }
      break;
      
    case STATE.FIRST_RESULT:
      if (!model.canSecond) {
        model.depart();
      } else {
        model.state = STATE.SECOND_DECISION;
      }
      lockInput();
      break;
      
    case STATE.SECOND_DECISION:
      if (isInside(x, y, 40, 20, 110, 30)) {
        // Close the bill
        model.message = "まいどあり。気をつけて。";
        model.state = STATE.SECOND_RESULT;
      } else if (isInside(x, y, 170, 20, 110, 30)) {
        // Offer another dish
        model.createSecondOptions();
        model.state = STATE.SECOND_CHOICE;
      }
      lockInput();
      break;
      
    case STATE.SECOND_CHOICE:
      for (let i = 0; i < 2; i++) {
        const cx = 60 + i * 110;
        const cy = 5;
        if (isInside(x, y, cx, cy, 90, 55)) {
          model.resolveSecond(i);
          lockInput();
          break;
        }
      }
      break;
      
    case STATE.SECOND_RESULT:
      model.depart();
      lockInput();
      break;
      
    case STATE.DEPARTURE:
      if (model.animT > 0.3) {
        model.animT = 1;
      }
      break;
      
    case STATE.SUMMARY:
      if (isInside(x, y, 100, 20, 120, 30)) {
        model.state = STATE.TITLE;
        lockInput();
      }
      break;
  }
}

// ==========================================
// Drawing
// ==========================================
function draw() {
  background(17, 19, 29); // Outer border color
  
  pushMatrix();
  translate(offsetX, offsetY);
  scale(scaleFactor, scaleFactor);
  
  // Clip to logical screen
  pushClip(0, 0, GAME_W, GAME_H);
  
  // Base background
  noStroke();
  fill(20, 25, 40);
  rectMode(CORNER);
  rect(0, 0, GAME_W, GAME_H);
  
  updateAnimations();
  
  if (model.state === STATE.TITLE) {
    drawTitle();
  } else {
    drawBackground();
    drawCustomer();
    drawStall();
    drawUI();
    
    if (model.state === STATE.SUMMARY) {
      drawSummary();
    }
  }
  
  popClip();
  popMatrix();
}

function updateAnimations() {
  model.animT += DeltaTime * 1.5;
  if (model.animT > 1) model.animT = 1;

  // 客席は少し右へ。鍋と会話欄の前を空ける。
  const targetX = 254;

  if (model.state === STATE.ARRIVAL) {
    model.customerX = lerp(GAME_W + 50, targetX, easeOut(model.animT));
    if (model.animT === 1) {
      model.createFirstOptions();
      model.state = STATE.FIRST_CHOICE;
    }
  } else if (model.state === STATE.DEPARTURE) {
    model.customerX = lerp(targetX, -50, easeIn(model.animT));
    if (model.animT === 1) {
      model.currentIndex++;
      model.nextCustomer();
    }
  }
}


function easeOut(t) { return t * (2 - t); }
function easeIn(t) { return t * t; }

// ----- Drawing Helpers -----
function drawPixelArt(px, py, dataArray, size = 2) {
  if (!dataArray) return;
  noStroke();
  for (let r = 0; r < dataArray.length; r++) {
    const row = dataArray[r];
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      const col = PALETTE[char];
      if (col) {
        fill(col.r, col.g, col.b);
        // Codea Y is bottom-up, so row 0 is top.
        const drawY = py + (dataArray.length - 1 - r) * size;
        const drawX = px + c * size;
        rect(drawX, drawY, size, size);
      }
    }
  }
}

function drawSplitText(str, x, y, maxLen, lineH) {
  textAlign("left");
  let cy = y;
  let currentLine = "";
  const lines = [];
  
  const rawLines = str.split("\n");
  for (const raw of rawLines) {
    for (let i = 0; i < raw.length; i++) {
      currentLine += raw[i];
      if (currentLine.length >= maxLen) {
        lines.push(currentLine);
        currentLine = "";
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = "";
    }
  }
  
  for (let i = lines.length - 1; i >= 0; i--) {
    text(lines[i], x, cy);
    cy += lineH;
  }
}

// ----- Scene Drawers -----
function drawBackground() {
  rectMode(CORNER);
  noStroke();

  // 冬の横丁。上は夜、下は湯気の溜まる路地。
  fill(19, 24, 37);
  rect(0, 0, GAME_W, GAME_H);

  fill(28, 34, 49);
  rect(0, 108, GAME_W, 72);

  fill(36, 42, 56);
  rect(0, 103, 52, 50);
  rect(59, 103, 48, 66);
  rect(115, 103, 54, 42);
  rect(177, 103, 62, 58);
  rect(248, 103, 72, 48);

  // 遠くの窓。灯りは派手でなく、店の暖かさを引き立てる程度。
  const windowGlow = 130 + Math.sin(ElapsedTime * 1.3) * 12;
  fill(223, 178, 94, windowGlow);
  rect(10, 123, 9, 13);
  rect(30, 137, 8, 10);
  rect(73, 121, 10, 14);
  rect(92, 145, 7, 9);
  rect(129, 119, 10, 12);
  rect(194, 128, 8, 14);
  rect(218, 116, 10, 10);
  rect(282, 127, 9, 13);
  rect(304, 145, 8, 10);

  // 路地の奥と濡れた地面。
  fill(27, 30, 39);
  rect(0, 58, GAME_W, 48);

  fill(31, 34, 42);
  rect(0, 0, GAME_W, 58);

  fill(68, 55, 45, 70);
  rect(0, 54, GAME_W, 4);

  // 雨の細い反射。
  stroke(126, 141, 157, 44);
  strokeWidth(1);

  for (let i = 0; i < 13; i++) {
    const px = 8 + i * 25;
    const py = 8 + ((i * 17) % 38);
    line(px, py, px + 11, py + 2);
  }

  noStroke();
}


function drawStall() {
  rectMode(CORNER);
  noStroke();

  // のれんのある小さな屋台。
  fill(40, 31, 31);
  rect(14, 103, 208, 48);

  fill(66, 43, 39);
  rect(18, 107, 200, 40);

  fill(121, 55, 47);
  rect(22, 112, 82, 29);
  rect(106, 112, 82, 29);
  rect(190, 112, 24, 29);

  fill(239, 221, 184);
  rect(31, 118, 62, 16);

  fill(86, 47, 40);
  textSize(9);
  textAlign("center");
  text("おでん", 62, 122);

  // 屋台の木枠。
  fill(88, 55, 40);
  rect(8, 57, GAME_W - 16, 10);

  fill(126, 80, 53);
  rect(8, 67, GAME_W - 16, 4);

  fill(73, 45, 36);
  rect(13, 71, GAME_W - 26, 25);

  // 鍋の外側と、だしの面。
  fill(52, 57, 65);
  rect(66, 68, 183, 30);

  fill(106, 111, 116);
  rect(70, 72, 175, 24);

  fill(48, 50, 55);
  rect(74, 75, 167, 18);

  const brothGlow = 9 + Math.sin(ElapsedTime * 2.0) * 3;
  fill(203, 145, 69);
  rect(76, 77, 163, 14);

  fill(255, 217, 144, brothGlow);
  rect(76, 87, 163, 4);

  // 仕切り。
  fill(91, 96, 101);
  rect(117, 75, 3, 18);
  rect(161, 75, 3, 18);
  rect(205, 75, 3, 18);

  // 具材は「いま選べるもの」ではなく、店の顔として少なめに置く。
  drawPixelArt(89, 79, ART.daikon, 2);
  drawPixelArt(130, 79, ART.egg, 2);
  drawPixelArt(173, 79, ART.ganmo, 2);
  drawPixelArt(217, 79, ART.chikuwa, 2);

  // 赤提灯。少しだけ揺れる。
  const swing = Math.sin(ElapsedTime * 1.6) * 3;

  pushMatrix();
  translate(286, 128);
  rotate(swing);

  fill(113, 45, 42);
  rectMode(CENTER);
  rect(0, 0, 26, 39);

  fill(188, 71, 59);
  rect(0, 0, 19, 33);

  fill(243, 219, 177);
  rect(0, 7, 14, 2);

  fill(50, 32, 29);
  textSize(8);
  textAlign("center");
  text("お", 0, -6);
  text("で", 0, 3);
  text("ん", 0, 12);

  popMatrix();

  // 鍋の上をゆっくり漂う湯気。
  rectMode(CORNER);
  fill(244, 240, 226, 32);

  const steamA = Math.sin(ElapsedTime * 1.2) * 3;
  rect(96, 101 + steamA, 10, 16);
  rect(150, 105 - steamA, 13, 17);
  rect(201, 101 + steamA * 0.6, 10, 19);
}


function drawCustomer() {
  if (!model.currentCustomer) return;

  const x = model.customerX;
  const y = 82;
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

  // 足元の影。
  fill(10, 13, 19, 110);
  rectMode(CORNER);
  rect(x - 21, y, 42, 4);

  // コートと首元。
  fill(coat.r, coat.g, coat.b);
  rect(x - 18, y + 3, 36, 44);

  fill(accent.r, accent.g, accent.b);
  rect(x - 6, y + 39, 12, 10);

  // 持ち物。
  if (customer.visual === "tourist") {
    fill(126, 83, 48);
    rect(x + 14, y + 12, 10, 17);

    fill(215, 192, 148);
    rect(x + 15, y + 20, 8, 5);
  } else if (customer.visual === "office_worker" || customer.visual === "inn_worker") {
    fill(39, 42, 48);
    rect(x - 25, y + 11, 8, 16);
  } else if (customer.visual === "student") {
    fill(42, 52, 73);
    rect(x - 25, y + 12, 9, 18);
  }

  // 顔と髪。
  fill(231, 196, 166);
  rect(x - 13, y + 46, 26, 27);

  fill(hair.r, hair.g, hair.b);
  rect(x - 14, y + 67, 28, 9);
  rect(x - 14, y + 58, 5, 12);

  // 目と口。
  fill(35, 31, 31);
  rect(x - 7, y + 59, 3, 3);
  rect(x + 4, y + 59, 3, 3);

  const pleased =
    (model.state === STATE.FIRST_RESULT && model.canSecond) ||
    (model.state === STATE.SECOND_RESULT && !model.message.includes("許して"));

  if (pleased) {
    rect(x - 4, y + 52, 8, 2);
  } else if (model.state === STATE.FIRST_RESULT && !model.canSecond) {
    rect(x - 4, y + 53, 8, 2);
  } else {
    rect(x - 3, y + 53, 6, 1);
  }

  // 雨の日のフード。
  if (customer.visual === "student") {
    fill(0, 0, 0, 0);
    stroke(119, 139, 174);
    strokeWidth(2);
    rect(x - 17, y + 49, 34, 31);
    noStroke();
  }
}


function drawUI() {
  rectMode(CORNER);
  noStroke();

  // 画面上部は一晩の記録。
  fill(12, 15, 23, 235);
  rect(0, 158, GAME_W, 22);

  fill(241, 230, 203);
  textSize(10);
  textAlign("left");
  text("今夜のおでん", 8, 166);

  fill(182, 190, 204);
  textSize(8);
  textAlign("center");
  text(`${model.currentIndex + 1} / ${model.customers.length} 人目`, GAME_W / 2, 166);

  fill(241, 230, 203);
  textSize(10);
  textAlign("right");
  text(`¥ ${model.sales}`, GAME_W - 8, 166);

  textSize(8);
  fill(151, 160, 177);
  textAlign("left");
  text(`満足 ${model.satisfaction}　常連 ${model.regulars}`, 8, 149);

  textAlign("right");
  text("湯気の向こう、雨の横丁", GAME_W - 8, 149);

  // 会話は左へ寄せ、右に立つ客と一つの画面に収める。
  if (model.message && model.state !== STATE.SUMMARY) {
    fill(18, 22, 30, 235);
    rect(10, 105, 214, 39);

    fill(95, 71, 56);
    rect(10, 140, 214, 4);

    let name = model.currentCustomer ? model.currentCustomer.name : "店主";

    if (model.state === STATE.SECOND_RESULT && model.message.startsWith("まいどあり")) {
      name = "店主";
    } else if (model.state === STATE.SECOND_RESULT && model.message.startsWith("はいよ")) {
      name = "店主";
    }

    fill(239, 218, 185);
    textSize(9);
    textAlign("left");
    text(name, 18, 130);

    fill(211, 214, 219);
    textSize(9);
    drawSplitText(model.message, 18, 112, 19, 11);
  }

  if (model.state === STATE.FIRST_CHOICE) {
    drawIngredientCards(model.options, 3, 20, 95);
  } else if (model.state === STATE.FIRST_RESULT) {
    drawTapToNext();
  } else if (model.state === STATE.SECOND_DECISION) {
    drawDecisionButtons();
  } else if (model.state === STATE.SECOND_CHOICE) {
    drawIngredientCards(model.secondOptions, 2, 60, 110);
  } else if (model.state === STATE.SECOND_RESULT) {
    drawTapToNext();
  }
}


function drawIngredientCards(options, count, startX, spacing) {
  rectMode(CORNER);
  noStroke();

  for (let i = 0; i < count; i++) {
    const item = options[i];
    const cx = startX + i * spacing;
    const cy = 5;

    // 屋台に吊るされた小さな注文札。
    fill(71, 48, 37);
    rect(cx - 1, cy - 1, 92, 57);

    fill(223, 207, 175);
    rect(cx + 1, cy + 1, 88, 53);

    fill(245, 236, 212);
    rect(cx + 4, cy + 4, 82, 47);

    fill(174, 111, 67);
    rect(cx + 4, cy + 48, 82, 3);

    drawPixelArt(cx + 38, cy + 27, ART[item.visual], 2);

    fill(61, 43, 35);
    textSize(10);
    textAlign("center");
    text(item.name, cx + 45, cy + 19);

    fill(153, 72, 52);
    textSize(8);
    text(`¥${item.price}`, cx + 45, cy + 10);

    fill(92, 84, 74);
    textSize(7);
    text(item.shortDesc, cx + 45, cy + 3);
  }
}


function drawDecisionButtons() {
  rectMode(CORNER);
  noStroke();

  // 色は正誤ではなく、屋台の札らしく。
  fill(72, 51, 39);
  rect(38, 18, 114, 34);

  fill(229, 216, 188);
  rect(41, 21, 108, 28);

  fill(76, 51, 40);
  textSize(10);
  textAlign("center");
  text("今日はここまで", 95, 33);

  fill(111, 61, 43);
  rect(168, 18, 114, 34);

  fill(206, 130, 77);
  rect(171, 21, 108, 28);

  fill(255, 243, 217);
  textSize(10);
  text("もう一品すすめる", 225, 33);
}


function drawTapToNext() {
  fill(245, 231, 203, 150 + Math.sin(ElapsedTime * 5) * 45);
  textSize(9);
  textAlign("center");
  text("タップして続ける　›", GAME_W / 2, 12);
}


function drawTitle() {
  rectMode(CORNER);
  noStroke();

  fill(19, 24, 37);
  rect(0, 0, GAME_W, GAME_H);

  fill(28, 34, 49);
  rect(0, 110, GAME_W, 70);

  fill(39, 41, 50);
  rect(0, 0, GAME_W, 70);

  // タイトルだけで、冷えた夜に屋台が開いていることを伝える。
  fill(50, 34, 32);
  rect(51, 72, 218, 45);

  fill(120, 55, 47);
  rect(67, 82, 96, 25);

  fill(239, 221, 184);
  rect(81, 88, 68, 13);

  fill(83, 44, 38);
  textSize(9);
  textAlign("center");
  text("おでん", 115, 91);

  fill(55, 58, 66);
  rect(100, 48, 120, 21);

  fill(207, 150, 71);
  rect(105, 53, 110, 11);

  drawPixelArt(121, 54, ART.daikon, 2);
  drawPixelArt(158, 54, ART.egg, 2);
  drawPixelArt(190, 54, ART.ganmo, 2);

  const swing = Math.sin(ElapsedTime * 1.7) * 3;

  pushMatrix();
  translate(252, 109);
  rotate(swing);

  rectMode(CENTER);

  fill(122, 48, 43);
  rect(0, 0, 28, 42);

  fill(190, 70, 59);
  rect(0, 0, 21, 36);

  fill(240, 220, 180);
  textSize(9);
  textAlign("center");
  text("おでん", 0, -3);

  popMatrix();

  fill(245, 233, 207);
  textSize(25);
  textAlign("center");
  text("今夜のおでん", GAME_W / 2, 136);

  textSize(10);
  fill(189, 194, 204);
  text("一品で帰すか、もう一品すすめるか。", GAME_W / 2, 121);

  fill(245, 233, 207, 150 + Math.sin(ElapsedTime * 5) * 90);
  textSize(9);
  text("タップして、のれんを出す", GAME_W / 2, 22);

  rectMode(CORNER);
}


function drawSummary() {
  rectMode(CORNER);
  noStroke();

  fill(7, 10, 16, 195);
  rect(0, 0, GAME_W, GAME_H);

  // 一日の帳面のような、少し黄ばんだまとめ画面。
  fill(68, 47, 38);
  rect(37, 17, 246, 145);

  fill(234, 220, 190);
  rect(40, 20, 240, 139);

  fill(246, 237, 214);
  rect(44, 24, 232, 131);

  fill(76, 52, 40);
  textSize(14);
  textAlign("center");
  text("今夜のしめ", GAME_W / 2, 138);

  textSize(10);
  textAlign("left");
  text(`売上： ¥${model.sales}`, 62, 118);
  text(`満足度： ${model.satisfaction}`, 62, 103);
  text(`常連になった： ${model.regulars} 人`, 62, 88);

  let top = "なし";
  let maxCount = 0;

  for (const [name, count] of Object.entries(model.soldCounts)) {
    if (count > maxCount) {
      maxCount = count;
      top = name;
    }
  }

  text(`一番売れた具： ${top} (${maxCount}回)`, 62, 73);

  let rep = "";

  if (model.satisfaction >= 5 && model.sales > 800) {
    rep = "湯気の向こうで、\n何人かの顔がほどけた。";
  } else if (model.satisfaction >= 5) {
    rep = "売上は控えめ。\nでも、また来たいと言う人がいた。";
  } else if (model.sales > 800) {
    rep = "よく売れた夜だった。\nただ、少し急かしすぎたかもしれない。";
  } else {
    rep = "今夜のだしは、\n少しだけ噛み合わなかった。";
  }

  fill(127, 82, 57);
  textSize(10);
  drawSplitText(rep, 62, 47, 21, 12);

  fill(116, 61, 43);
  rect(98, 25, 124, 22);

  fill(255, 241, 214);
  textAlign("center");
  textSize(9);
  text("もう一晩やる", GAME_W / 2, 31);
}

