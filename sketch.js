// ==========================================
// Constants & Game Data
// ==========================================
const GAME_W = 180;
const GAME_H = 320;

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
  { id: "DAIKON", name: "だいこん", price: 120, shortDesc: "しみる、やさしい", visual: "daikon" },
  { id: "EGG", name: "たまご", price: 130, shortDesc: "少し元気が出る", visual: "egg" },
  { id: "BEEF_TENDON", name: "牛すじ", price: 220, shortDesc: "濃くて満たされる", visual: "beef" },
  { id: "KONNYAKU", name: "こんにゃく", price: 100, shortDesc: "軽く、気楽に", visual: "konnyaku" },
  { id: "GANMODOKI", name: "がんも", price: 150, shortDesc: "だしを楽しむ", visual: "ganmo" },
  { id: "MOCHI_POUCH", name: "餅巾着", price: 190, shortDesc: "今日はちょっと特別", visual: "mochi" },
  { id: "CHIKUWA", name: "ちくわ", price: 110, shortDesc: "気軽な小腹みたし", visual: "chikuwa" },
  { id: "SHIRATAKI", name: "しらたき", price: 90, shortDesc: "控えめ、軽やか", visual: "shirataki" }
];

const CUSTOMERS_DB = [
  {
    id: "SAEKI", name: "佐伯さん", visual: "office_worker",
    line: "終電まで、あと七分なんだ。\n冷えただけだから、すぐ食べられるものを",
    idealFirst: ["DAIKON", "KONNYAKU", "SHIRATAKI"],
    okayFirst: ["EGG", "CHIKUWA"],
    badFirst: ["BEEF_TENDON", "MOCHI_POUCH"],
    goodSecond: ["EGG", "CHIKUWA"],
    badSecond: ["MOCHI_POUCH", "BEEF_TENDON"],
    successLine: "これ、ちょうどよかった。",
    okayLine: "うん、これなら間に合いそう。",
    missLine: "おいしそうだけど......今日は急いでいて。",
    oversoldLine: "今日は、これくらいでよかったかも。"
  },
  {
    id: "MINATO", name: "ミナトさん", visual: "regular_worker",
    line: "今日は軽くでいいよ。\n財布が、ちょっと冬みたいでさ",
    idealFirst: ["KONNYAKU", "CHIKUWA", "SHIRATAKI"],
    okayFirst: ["DAIKON", "EGG"],
    badFirst: ["BEEF_TENDON", "MOCHI_POUCH"],
    goodSecond: ["DAIKON", "CHIKUWA"],
    badSecond: ["BEEF_TENDON", "MOCHI_POUCH"],
    successLine: "助かる。今日はこういうのでいいんだ。",
    okayLine: "悪くないね。あったまる。",
    missLine: "今日は、ちょっと贅沢すぎるかな。",
    oversoldLine: "あはは......今日は財布が追いつかないよ。"
  },
  {
    id: "TOYAMA", name: "遠山さん", visual: "happy_worker",
    line: "今日、少しだけいいことがあってね。\n帰る前に、ひとつ景気づけを",
    idealFirst: ["BEEF_TENDON", "EGG", "MOCHI_POUCH"],
    okayFirst: ["DAIKON", "GANMODOKI"],
    badFirst: ["SHIRATAKI", "KONNYAKU"],
    goodSecond: ["BEEF_TENDON", "MOCHI_POUCH", "EGG"],
    badSecond: ["SHIRATAKI", "KONNYAKU"],
    successLine: "いいね。今日はこれくらい、許される。",
    okayLine: "なんだか、少し落ち着いたよ。",
    missLine: "今日はもう少し、景気よくいきたかったな。",
    oversoldLine: "いや、これはちょっと食べすぎたかも。"
  },
  {
    id: "NONOMURA", name: "野々村さん", visual: "inn_worker",
    line: "宴会が長くてね。\n胃に怒られないやつ、ある?",
    idealFirst: ["DAIKON", "GANMODOKI", "SHIRATAKI"],
    okayFirst: ["KONNYAKU", "CHIKUWA"],
    badFirst: ["BEEF_TENDON", "MOCHI_POUCH"],
    goodSecond: ["DAIKON", "SHIRATAKI"],
    badSecond: ["BEEF_TENDON", "MOCHI_POUCH", "EGG"],
    successLine: "これなら、胃も文句を言わない。",
    okayLine: "うん、今日はこれくらいがいい。",
    missLine: "おいしそうなんだけどね。今夜は勘弁しておこう。",
    oversoldLine: "店主さん、今日はもう許して。"
  },
  {
    id: "YUKI", name: "ユキさん", visual: "tourist",
    line: "温泉、すごくよかったです。\nこの町らしいものを食べたくて",
    idealFirst: ["DAIKON", "GANMODOKI", "MOCHI_POUCH"],
    okayFirst: ["EGG", "BEEF_TENDON"],
    badFirst: ["SHIRATAKI"],
    goodSecond: ["MOCHI_POUCH", "EGG"],
    badSecond: ["SHIRATAKI", "KONNYAKU"],
    successLine: "ああ、これを食べに来た感じがします。",
    okayLine: "おいしいです。あったまりますね。",
    missLine: "悪くないけど、もう少し町らしいものがよかったかも。",
    oversoldLine: "おいしいけれど、ちょっと多かったですね。"
  },
  {
    id: "KOTA", name: "コウタ", visual: "student",
    line: "雨、全然やまないなあ。\n小腹だけ、なんとかしたいです",
    idealFirst: ["CHIKUWA", "EGG", "KONNYAKU"],
    okayFirst: ["DAIKON", "GANMODOKI"],
    badFirst: ["BEEF_TENDON", "MOCHI_POUCH"],
    goodSecond: ["CHIKUWA", "EGG"],
    badSecond: ["BEEF_TENDON", "MOCHI_POUCH"],
    successLine: "これ、ちょうどいいです。",
    okayLine: "あったまります。助かる。",
    missLine: "うーん、今日はもっと軽いのでよかったかも。",
    oversoldLine: "えっ、そんなに食べられないですって。"
  }
];

// ==========================================
// Pixel Art Data
// ==========================================
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
  "P": { r: 240, g: 120, b: 120 }, "p": { r: 200, g: 80, b: 80 },
  "D": { r: 40, g: 40, b: 50 }, "d": { r: 20, g: 20, b: 30 },
  "T": { r: 120, g: 90, b: 60 }, "R": { r: 200, g: 60, b: 60 }
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

    if (ideal.length === 0) ideal = [INGREDIENTS[0]];
    if (okay.length === 0) okay = [INGREDIENTS[1]];
    if (bad.length === 0) bad = [INGREDIENTS[2]];

    const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    this.options = [
      pickRandom(ideal),
      pickRandom(okay),
      pickRandom(bad)
    ].sort(() => Math.random() - 0.5);
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

    if (good.length === 0) good = [INGREDIENTS[0]];
    if (bad.length === 0) bad = [INGREDIENTS[2]];

    const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    this.secondOptions = [
      pickRandom(good),
      pickRandom(bad)
    ].sort(() => Math.random() - 0.5);
  }

  resolveSecond(idx) {
    const dish = this.secondOptions[idx];
    const c = this.currentCustomer;

    this.soldCounts[dish.name] = (this.soldCounts[dish.name] || 0) + 1;
    this.sales += dish.price;

    if (c.goodSecond.includes(dish.id)) {
      this.satisfaction += 2;
      this.regulars += 1;
      this.message = "お代わり、ありがとうね。";
    } else if (c.badSecond.includes(dish.id)) {
      this.satisfaction -= 2;
      this.regulars = Math.max(0, this.regulars - 1);
      this.message = c.oversoldLine;
    } else {
      this.message = "はいよ、お待ちどうさま。";
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

  const gx = (touch.x - offsetX) / scaleFactor;
  const gy = (touch.y - offsetY) / scaleFactor;

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

function rectFromTop(x, topY, w, h) {
    return {
        x: x,
        y: GAME_H - topY - h,
        w: w,
        h: h
    };
}

function textYFromTop(topY) {
    return GAME_H - topY;
}

function getDecisionButtonRects() {
    return {
        close: rectFromTop(10, 217, 160, 40),
        more: rectFromTop(10, 268, 160, 40)
    };
}


function getChoiceCardRect(index, count) {
    if (count === 2) {
        // 上から 0番目、1番目の順に並べる
        return rectFromTop(10, 222 + index * 48, 160, 42);
    }

    // 上から options[0]、options[1]、options[2] の順に並べる
    return rectFromTop(10, 204 + index * 38, 160, 34);
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
            if (model.animT > 0.3) model.animT = 1;
            break;

        case STATE.FIRST_CHOICE:
            for (let i = 0; i < 3; i++) {
                const card = getChoiceCardRect(i, 3);

                if (isInside(x, y, card.x, card.y, card.w, card.h)) {
                    model.resolveFirst(i);
                    lockInput();
                    break;
                }
            }
            break;

        case STATE.FIRST_RESULT:
            if (model.canSecond) {
                model.state = STATE.SECOND_DECISION;
            } else {
                model.depart();
            }

            lockInput();
            break;

        case STATE.SECOND_DECISION: {
            const buttons = getDecisionButtonRects();

            if (isInside(x, y, buttons.close.x, buttons.close.y, buttons.close.w, buttons.close.h)) {
                model.message = "まいどあり。気をつけて。";
                model.state = STATE.SECOND_RESULT;
                lockInput();
            } else if (isInside(x, y, buttons.more.x, buttons.more.y, buttons.more.w, buttons.more.h)) {
                model.createSecondOptions();
                model.state = STATE.SECOND_CHOICE;
                lockInput();
            }
            break;
        }

        case STATE.SECOND_CHOICE:
            for (let i = 0; i < 2; i++) {
                const card = getChoiceCardRect(i, 2);

                if (isInside(x, y, card.x, card.y, card.w, card.h)) {
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
            if (model.animT > 0.3) model.animT = 1;
            break;

        case STATE.SUMMARY:
            if (isInside(x, y, 33, 45, 114, 26)) {
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
  background(17, 19, 29);

  pushMatrix();
  translate(offsetX, offsetY);
  scale(scaleFactor, scaleFactor);

  pushClip(0, 0, GAME_W, GAME_H);

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

  if (model.animT > 1) {
    model.animT = 1;
  }

  const targetX = 140;

  if (model.state === STATE.ARRIVAL) {
    model.customerX = lerp(GAME_W + 40, targetX, easeOut(model.animT));

    if (model.animT === 1) {
      model.createFirstOptions();
      model.state = STATE.FIRST_CHOICE;
    }
  } else if (model.state === STATE.DEPARTURE) {
    model.customerX = lerp(targetX, -40, easeIn(model.animT));

    if (model.animT === 1) {
      model.currentIndex++;
      model.nextCustomer();
    }
  }
}

function easeOut(t) {
  return t * (2 - t);
}

function easeIn(t) {
  return t * t;
}

// ==========================================
// Drawing Helpers
// ==========================================
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

// ==========================================
// Scene Drawers
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

  const windowGlow = 112 + Math.sin(ElapsedTime * 1.2) * 12;
  fill(224, 181, 96, windowGlow);
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
    text("おでん", 38, 235);

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

    // 客の顔に重ならないよう、少し右上へ移動
    const swing = Math.sin(ElapsedTime * 1.6) * 3;

    pushMatrix();
    translate(165, 258);
    rotate(swing);

    rectMode(CENTER);

    fill(113, 45, 42);
    rect(0, 0, 23, 35);

    fill(188, 71, 59);
    rect(0, 0, 17, 29);

    fill(243, 219, 177);
    rect(0, 7, 12, 2);

    fill(50, 32, 29);
    textSize(7);
    textAlign("center");

    // CodeaはY軸が下から上なので、表示順は逆に置く
    text("お", 0, 12);
    text("で", 0, 4);
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
  rectMode(CORNER);
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

  const pleased =
    (model.state === STATE.FIRST_RESULT && model.canSecond) ||
    (model.state === STATE.SECOND_RESULT && !model.message.includes("許して"));

  if (pleased) {
    rect(x - 3, y + 45, 6, 2);
  } else if (model.state === STATE.FIRST_RESULT && !model.canSecond) {
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

function drawUI() {
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
  text(`${model.currentIndex + 1} / ${model.customers.length} 人目`, GAME_W / 2, 303);

  fill(241, 230, 203);
  textSize(10);
  textAlign("right");
  text(`¥ ${model.sales}`, GAME_W - 8, 303);

  textSize(8);
  fill(151, 160, 177);
  textAlign("left");
  text(`満足 ${model.satisfaction} 常連 ${model.regulars}`, 8, 281);

  textAlign("right");
  text("雨の横丁", GAME_W - 8, 281);

  if (model.message && model.state !== STATE.SUMMARY) {
    fill(17, 21, 29, 238);
    rect(9, 132, 162, 41);

    fill(95, 71, 56);
    rect(9, 132, 162, 3);

    let name = model.currentCustomer ? model.currentCustomer.name : "店主";

    if (model.state === STATE.SECOND_RESULT && model.message.startsWith("まいどあり")) {
      name = "店主";
    } else if (model.state === STATE.SECOND_RESULT && model.message.startsWith("はいよ")) {
      name = "店主";
    }

    fill(239, 218, 185);
    textSize(9);
    textAlign("left");
    text(name, 17, 160);

    fill(211, 214, 219);
    textSize(9);
    drawSplitText(model.message, 17, 143, 18, 10);
  }

  if (model.state === STATE.FIRST_CHOICE) {
    drawIngredientCards(model.options, 3);
  } else if (model.state === STATE.FIRST_RESULT) {
    drawTapToNext();
  } else if (model.state === STATE.SECOND_DECISION) {
    drawDecisionButtons();
  } else if (model.state === STATE.SECOND_CHOICE) {
    drawIngredientCards(model.secondOptions, 2);
  } else if (model.state === STATE.SECOND_RESULT) {
    drawTapToNext();
  }
}

function drawIngredientCards(options, count) {
  rectMode(CORNER);
  noStroke();

  for (let i = 0; i < count; i++) {
    const item = options[i];
    const card = getChoiceCardRect(i, count);

    const x = card.x;
    const y = card.y;
    const w = card.w;
    const h = card.h;

    fill(70, 48, 37);
    rect(x - 1, y - 1, w + 2, h + 2);

    fill(223, 207, 175);
    rect(x + 1, y + 1, w - 2, h - 2);

    fill(246, 237, 214);
    rect(x + 4, y + 4, w - 8, h - 8);

    fill(177, 113, 68);
    rect(x + 4, y + 4, 3, h - 8);

    drawPixelArt(x + 16, y + Math.floor((h - 12) / 2), ART[item.visual], 2);

    fill(61, 43, 35);
    textSize(10);
    textAlign("left");
    text(item.name, x + 43, y + h - 17);

    fill(153, 72, 52);
    textSize(9);
    textAlign("right");
    text(`¥${item.price}`, x + w - 10, y + h - 17);

    fill(92, 84, 74);
    textSize(7);
    textAlign("left");
    text(item.shortDesc, x + 43, y + 8);
  }
}

function drawDecisionButtons() {
    rectMode(CORNER);
    noStroke();

    const buttons = getDecisionButtonRects();
    const close = buttons.close;
    const more = buttons.more;

    // 上段：今日はここまで
    fill(72, 51, 39);
    rect(close.x, close.y, close.w, close.h);

    fill(229, 216, 188);
    rect(close.x + 3, close.y + 3, close.w - 6, close.h - 6);

    fill(76, 51, 40);
    textSize(11);
    textAlign("center");
    text("今日はここまで", GAME_W / 2, textYFromTop(238));

    fill(118, 91, 71);
    textSize(7);
    text("会計にして、送り出す", GAME_W / 2, textYFromTop(249));

    // 下段：もう一品すすめる
    fill(111, 61, 43);
    rect(more.x, more.y, more.w, more.h);

    fill(206, 130, 77);
    rect(more.x + 3, more.y + 3, more.w - 6, more.h - 6);

    fill(255, 243, 217);
    textSize(11);
    text("もう一品すすめる", GAME_W / 2, textYFromTop(289));

    fill(255, 231, 194);
    textSize(7);
    text("今夜なら、もう少しいける？", GAME_W / 2, textYFromTop(300));
}


function drawTapToNext() {
  fill(245, 231, 203, 150 + Math.sin(ElapsedTime * 5) * 45);
  textSize(9);
  textAlign("center");
  text("タップして続ける ›", GAME_W / 2, 20);
}

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
    text("おでん", 0, -3);

    popMatrix();

    rectMode(CORNER);

    fill(245, 233, 207);
    textSize(24);
    textAlign("center");
    text("今夜のおでん", GAME_W / 2, 252);

    textSize(9);
    fill(189, 194, 204);
    text("一品で帰すか、もう一品すすめるか。", GAME_W / 2, 234);

    // 屋台の直後へ寄せ、画面下の空白を少し整える
    fill(245, 233, 207, 150 + Math.sin(ElapsedTime * 5) * 90);
    textSize(9);
    text("タップして、のれんを出す", GAME_W / 2, 58);
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
  text("今夜のしめ", GAME_W / 2, 255);

  textSize(10);
  textAlign("left");
  text(`売上: ¥${model.sales}`, 34, 227);
  text(`満足度: ${model.satisfaction}`, 34, 210);
  text(`常連になった: ${model.regulars} 人`, 34, 193);

  let top = "なし";
  let maxCount = 0;

  for (const [name, count] of Object.entries(model.soldCounts)) {
    if (count > maxCount) {
      maxCount = count;
      top = name;
    }
  }

  text(`一番売れた具: ${top} (${maxCount}回)`, 34, 176);

  let rep = "";

  if (model.satisfaction >= 5 && model.sales > 800) {
    rep = "湯気の向こうで、\n何人かの顔がほどけた。";
  } else if (model.satisfaction >= 5) {
    rep = "売上は控えめ。\nでも、また来たいと言う人がいた。";
  } else if (model.sales > 800) {
    rep = "よく売れた夜だった。\nただ、少し急かしすぎたかもしれない。";
  } else {
    rep = "今夜のだしは、\n少しだけ噛み合わなかった。";
  }

  fill(127, 82, 57);
  textSize(10);
  drawSplitText(rep, 34, 117, 14, 13);

  fill(116, 61, 43);
  rect(33, 45, 114, 26);

  fill(255, 241, 214);
  textAlign("center");
  textSize(9);
  text("もう一晩やる", GAME_W / 2, 54);
}
