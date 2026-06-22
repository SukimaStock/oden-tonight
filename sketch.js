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
  
  const targetX = GAME_W / 2;
  
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
  // Night sky & faint buildings
  noStroke();
  fill(30, 35, 50);
  rect(0, 100, GAME_W, 80);
  fill(40, 45, 60);
  rect(0, 100, 30, 40);
  rect(40, 100, 50, 60);
  rect(200, 100, 80, 30);
  rect(290, 100, 40, 50);
}

function drawStall() {
  // Counter
  fill(100, 60, 40);
  rectMode(CORNER);
  rect(0, 60, GAME_W, 40);
  fill(120, 75, 50);
  rect(0, 95, GAME_W, 5); // edge
  
  // Pot
  fill(80, 80, 90);
  rect(90, 70, 140, 25);
  fill(60, 60, 70);
  rect(95, 75, 130, 20); // inside
  
  // Broth
  fill(200, 140, 50, 200);
  rect(95, 75, 130, 15);
  
  // Dividers
  fill(150, 150, 160);
  rect(135, 75, 2, 20);
  rect(180, 75, 2, 20);
  
  // Ingredients in pot
  drawPixelArt(105, 80, ART.daikon, 2);
  drawPixelArt(145, 80, ART.egg, 2);
  drawPixelArt(190, 80, ART.beef, 2);
  
  // Steam
  fill(255, 255, 255, 40);
  const stY = 100 + Math.sin(ElapsedTime * 2) * 5;
  rect(110, stY, 15, 15);
  rect(155, stY + 5, 20, 20);
  rect(195, stY - 2, 18, 18);
  
  // Lantern
  const rot = Math.sin(ElapsedTime * 1.5) * 5;
  pushMatrix();
  translate(40, 140);
  rotate(rot);
  fill(180, 50, 50);
  rectMode(CENTER);
  rect(0, 0, 30, 40);
  fill(220, 80, 80);
  rect(0, 0, 20, 35);
  fill(0, 0, 0);
  textSize(12);
  textAlign("center");
  text("おでん", 0, -5);
  popMatrix();
  rectMode(CORNER);
}

function drawCustomer() {
  if (!model.currentCustomer) return;
  
  const x = model.customerX;
  const y = 100; // stand behind counter
  
  fill(60, 65, 80);
  rect(x - 20, y, 40, 60); // body
  fill(230, 200, 180);
  rect(x - 15, y + 60, 30, 30); // head
  
  // Simple face based on status
  fill(0, 0, 0);
  rect(x - 8, y + 75, 4, 4); // eye L
  rect(x + 4, y + 75, 4, 4); // eye R
  
  if (model.state === STATE.FIRST_RESULT && model.canSecond) {
    rect(x - 4, y + 65, 8, 2);
  } else if (model.state === STATE.FIRST_RESULT && !model.canSecond) {
    rect(x - 4, y + 65, 8, 2);
  } else {
    rect(x - 4, y + 67, 8, 2);
  }
}

function drawUI() {
  // Header
  fill(20, 20, 25, 220);
  rect(0, 160, GAME_W, 20);
  
  fill(255, 255, 255);
  textSize(10);
  textAlign("left");
  text("今夜のおでん", 5, 166);
  
  textAlign("center");
  text(`${model.currentIndex + 1} / ${model.customers.length} 人目`, GAME_W / 2, 166);
  
  textAlign("right");
  text(`¥ ${model.sales}`, GAME_W - 5, 166);
  
  // Status tiny
  textSize(8);
  fill(180, 180, 200);
  textAlign("left");
  text(`満足 ${model.satisfaction}  常連 ${model.regulars}`, 5, 150);
  textAlign("right");
  text("横丁の空気：あたたかい", GAME_W - 5, 150);
  
  // Dialogue box
  if (model.message && model.state !== STATE.SUMMARY) {
    fill(30, 35, 45, 240);
    rect(10, 65, 300, 40);
    fill(240, 240, 240);
    textSize(10);
    textAlign("left");
    
    let name = model.currentCustomer ? model.currentCustomer.name : "店主";
    if (model.state === STATE.SECOND_RESULT && model.message.startsWith("まいどあり")) name = "店主";
    else if (model.state === STATE.SECOND_RESULT && model.message.startsWith("はいよ")) name = "店主";
    
    text(name, 15, 90);
    fill(200, 200, 200);
    drawSplitText(model.message, 25, 80, 25, 12);
  }
  
  // State-specific UI
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
  for (let i = 0; i < count; i++) {
    const item = options[i];
    const cx = startX + i * spacing;
    const cy = 5;
    
    fill(220, 200, 170); // wooden card
    rect(cx, cy, 90, 55);
    
    fill(80, 60, 40);
    rect(cx + 2, cy + 2, 86, 51); // inner frame
    
    fill(240, 230, 210);
    rect(cx + 4, cy + 4, 82, 47);
    
    // Art
    drawPixelArt(cx + 38, cy + 30, ART[item.visual], 2);
    
    fill(0, 0, 0);
    textSize(10);
    textAlign("center");
    text(item.name, cx + 45, cy + 20);
    
    textSize(8);
    fill(100, 50, 50);
    text(`¥${item.price}`, cx + 45, cy + 10);
    
    fill(50, 50, 50);
    text(item.shortDesc, cx + 45, cy + 2);
  }
}

function drawDecisionButtons() {
  const btnW = 110;
  const btnH = 30;
  
  // Bill
  fill(200, 80, 80);
  rect(40, 20, btnW, btnH);
  fill(255, 255, 255);
  textSize(12);
  textAlign("center");
  text("会計にする", 40 + btnW / 2, 20 + btnH / 2 - 4);
  
  // Another dish
  fill(80, 150, 80);
  rect(170, 20, btnW, btnH);
  fill(255, 255, 255);
  text("もう一品どうです？", 170 + btnW / 2, 20 + btnH / 2 - 4);
}

function drawTapToNext() {
  fill(255, 255, 255, 150 + Math.sin(ElapsedTime * 5) * 50);
  textSize(10);
  textAlign("center");
  text("▼ タップして次へ", GAME_W / 2, 10);
}

function drawTitle() {
  fill(20, 25, 40);
  rect(0, 0, GAME_W, GAME_H);
  
  // Background lantern
  const rot = Math.sin(ElapsedTime * 2) * 3;
  pushMatrix();
  translate(GAME_W / 2, GAME_H - 40);
  rotate(rot);
  fill(180, 50, 50);
  rectMode(CENTER);
  rect(0, 0, 40, 50);
  fill(220, 80, 80);
  rect(0, 0, 30, 45);
  fill(0, 0, 0);
  textSize(16);
  textAlign("center");
  text("おでん", 0, 0);
  popMatrix();
  rectMode(CORNER);
  
  fill(255, 255, 255);
  textSize(24);
  textAlign("center");
  text("今夜のおでん", GAME_W / 2, 80);
  
  textSize(10);
  fill(180, 180, 200);
  text("一品で帰すか、もう一品すすめるか。", GAME_W / 2, 60);
  
  fill(255, 255, 255, 150 + Math.sin(ElapsedTime * 5) * 100);
  text("- TAP TO OPEN -", GAME_W / 2, 20);
}

function drawSummary() {
  fill(0, 0, 0, 180);
  rect(0, 0, GAME_W, GAME_H);
  
  fill(240, 230, 210);
  rect(40, 20, 240, 140);
  
  fill(60, 40, 30);
  rect(42, 22, 236, 136);
  fill(240, 230, 210);
  rect(44, 24, 232, 132);
  
  fill(0, 0, 0);
  textSize(14);
  textAlign("center");
  text("今夜のしめ", GAME_W / 2, 140);
  
  textSize(10);
  textAlign("left");
  text(`売上： ¥${model.sales}`, 60, 120);
  text(`満足度： ${model.satisfaction}`, 60, 105);
  text(`常連になった： ${model.regulars} 人`, 60, 90);
  
  // Find top seller
  let top = "なし";
  let maxCount = 0;
  for (const [name, count] of Object.entries(model.soldCounts)) {
    if (count > maxCount) {
      maxCount = count;
      top = name;
    }
  }
  text(`一番売れた具： ${top} (${maxCount}回)`, 60, 75);
  
  // Evaluate reputation
  let rep = "";
  if (model.satisfaction >= 5 && model.sales > 800) {
    rep = "湯気の向こうで、何人かの顔がほどけた。";
  } else if (model.satisfaction >= 5) {
    rep = "売上は控えめ。でも、また来たいと言う人がいた。";
  } else if (model.sales > 800) {
    rep = "よく売れた夜だった。\nただ、少し急かしすぎたかもしれない。";
  } else {
    rep = "今夜のだしは、少しだけ噛み合わなかった。";
  }
  
  fill(80, 50, 50);
  drawSplitText(rep, 60, 55, 20, 12);
  
  // Retry button
  fill(200, 80, 80);
  rect(100, 20, 120, 20);
  fill(255, 255, 255);
  textAlign("center");
  text("もう一晩やる", GAME_W / 2, 25);
}
