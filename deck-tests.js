const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs/promises");
const { pathToFileURL } = require("node:url");
const { launchBrowser } = require("./export-deck");
const root = path.join(__dirname, "downloads", "test-results");
const url = pathToFileURL(path.join(__dirname, "index.html")).href;
let browser;

(async () => {
  await fs.mkdir(root, { recursive: true });
  browser = await launchBrowser();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(`page: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("requestfailed", request => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
  await page.goto(url);
  await page.waitForTimeout(1800);
  assert.equal(await page.evaluate(() => gsap.version), "3.15.1");
  assert.equal(await page.locator("#fatal").isVisible(), false);
  assert.equal((await page.evaluate(() => MeterSeDeck.getState())).step, 0);

  for (let i = 0; i < 4; i++) await page.keyboard.press("Space");
  await page.waitForTimeout(1100);
  assert.deepEqual(await page.evaluate(() => [MeterSeDeck.getState().slide, MeterSeDeck.getState().step]), [0, 4]);
  assert.equal(await page.locator(".intro-fact:visible").count(), 3);
  assert.equal(await page.locator(".light.green").evaluate(el => getComputedStyle(el).opacity), "1");
  await page.screenshot({ path: `${root}/intro-final.png` });

  const exit = await page.evaluate(() => {
    const time = MeterSeDeck.timeline.time();
    MeterSeDeck.next();
    gsap.killTweensOf(MeterSeDeck.timeline);
    MeterSeDeck.timeline.pause(time + .55, false);
    gsap.ticker.tick();
    return { top: document.querySelector(".route-bike").getBoundingClientRect().top, bottom: document.querySelector("#stage").getBoundingClientRect().bottom };
  });
  assert.ok(exit.top > exit.bottom);
  await page.evaluate(() => MeterSeDeck.previous());
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(2700);
  assert.deepEqual(await page.evaluate(() => [MeterSeDeck.getState().slide, MeterSeDeck.getState().step]), [1, 0]);
  for (let i = 0; i < 4; i++) await page.keyboard.press("Enter");
  await page.waitForTimeout(1100);
  assert.equal(await page.locator(".team-card:visible").count(), 4);
  assert.deepEqual(await page.locator(".team-card").evaluateAll(elements => elements.map(element => getComputedStyle(element).opacity)), ["1", "1", "1", "1"]);
  assert.equal(await page.locator(".route-jeep .rider:visible").count(), 4);
  await page.screenshot({ path: `${root}/team-final.png` });

  await page.evaluate(() => MeterSeDeck.jump(2));
  assert.deepEqual(await page.locator(".problem-card").evaluateAll(els => els.map(el => getComputedStyle(el).opacity)), ["0.55", "0.55", "1"]);
  const problemEnd = await page.locator(".route-old").getAttribute("style");
  await page.keyboard.press("ArrowLeft");
  assert.deepEqual(await page.evaluate(() => [MeterSeDeck.getState().slide, MeterSeDeck.getState().step]), [2, 2]);
  assert.deepEqual(await page.locator(".problem-card").evaluateAll(els => els.map(el => getComputedStyle(el).opacity)), ["0.55", "1", "0"]);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1700);
  assert.equal(await page.locator(".route-old").getAttribute("style"), problemEnd);
  await page.screenshot({ path: `${root}/problem-final.png` });

  await page.evaluate(() => MeterSeDeck.jump(3));
  const ev = await page.evaluate(() => {
    const route = gsap.getProperty(".route-ev", "y");
    const scale = Number(document.querySelector("#ev-trail").style.transform.match(/scaleY\(([^)]+)\)/)[1]);
    return { route, trail: 3 * 1680 + 160 + scale * 920, start: 3 * 1680 + 160 };
  });
  const evY = ev.route;
  assert.ok(Math.abs(ev.trail - evY) < .1 && ev.trail > ev.start);
  await page.screenshot({ path: `${root}/solution-final.png` });

  await page.evaluate(() => MeterSeDeck.jump(4));
  assert.equal(await page.locator(".tech-logos").evaluate(el => getComputedStyle(el).opacity), "1");
  await page.keyboard.press("ArrowLeft");
  assert.deepEqual(await page.evaluate(() => [MeterSeDeck.getState().slide, MeterSeDeck.getState().step]), [4, 4]);
  assert.equal(await page.locator(".tech-logos").evaluate(el => getComputedStyle(el).opacity), "0");
  assert.deepEqual(await page.evaluate(() => ["#bp-chassis", "#bp-engine", "#bp-left", "#bp-right"].map(s => Math.round(gsap.getProperty(s, "x")))), [-55, 75, -65, 65]);
  await page.screenshot({ path: `${root}/tech-exploded.png` });

  await page.evaluate(() => MeterSeDeck.jump(5));
  const data = await page.evaluate(() => DECK_CONFIG.funding.items.map((item, i) => ({
    percent: item.percent,
    y: gsap.getProperty(`#convoy-${i}`, "y"),
    trail: Number.parseFloat(getComputedStyle(document.querySelector(`#trail-${i}`)).height),
    visible: getComputedStyle(document.querySelector(`#fund-label-${i}`)).opacity
  })));
  data.forEach(item => {
    assert.ok(Math.abs(item.y - (5 * 1680 + 365) - item.percent * 10) < .01);
    assert.ok(Math.abs(item.trail - item.percent * 10) < .01);
    assert.equal(item.visible, "1");
  });
  assert.equal(await page.locator("#fund-value").textContent(), "$1,000,000");
  await page.screenshot({ path: `${root}/funding-final.png` });
  await page.keyboard.press("ArrowLeft");
  assert.equal(await page.locator("#fund-label-4").evaluate(el => getComputedStyle(el).opacity), "0");
  assert.equal(await page.locator("#trail-4").evaluate(el => parseFloat(getComputedStyle(el).height)), 0);

  await page.evaluate(() => MeterSeDeck.jump(6));
  assert.equal(await page.locator(".finish-car:visible").count(), 5);
  await page.screenshot({ path: `${root}/finish-final.png` });
  await page.keyboard.press("Space");
  await page.waitForTimeout(1800);
  assert.equal(await page.locator(".overview-button:visible").count(), 7);
  await page.screenshot({ path: `${root}/overview.png` });
  const hit = await page.locator('.scene-hit[data-jump="2"]').boundingBox();
  await page.mouse.click(hit.x + hit.width / 2, hit.y + hit.height / 2);
  assert.deepEqual(await page.evaluate(() => [MeterSeDeck.getState().slide, MeterSeDeck.getState().step]), [2, 3]);
  for (const [key, step] of [["Backspace", 2], ["PageUp", 1], ["ArrowUp", 0], ["PageDown", 1], ["ArrowDown", 2], ["ArrowRight", 3]]) {
    await page.keyboard.press(key);
    assert.equal((await page.evaluate(() => MeterSeDeck.getState())).step, step);
  }

  const popupPromise = page.waitForEvent("popup");
  await page.keyboard.press("p");
  const popup = await popupPromise;
  assert.equal(popup.url(), "about:blank");
  assert.match(await popup.locator("#notes-value").textContent(), /customer pain/);
  assert.match(await popup.locator("#current-value").textContent(), /PAIN POINT 03/);
  assert.match(await popup.locator("#timer-value").textContent(), /^\d\d:\d\d:\d\d$/);
  await popup.locator("#prev").click();
  assert.equal((await page.evaluate(() => MeterSeDeck.getState())).step, 2);
  await popup.close();

  await page.evaluate(() => MeterSeDeck.preparePrint());
  assert.equal(await page.locator(".print-page").count(), 7);
  const pdf = await page.pdf({ path: `${root}/deck-test.pdf`, printBackground: true, preferCSSPageSize: true });
  assert.ok(pdf.length > 10000);
  assert.equal((pdf.toString("latin1").match(/\/Type \/Page\b/g) || []).length, 7);
  await page.evaluate(() => { window.printCalls = 0; window.print = () => window.printCalls++; });
  await page.keyboard.press("Control+p");
  assert.equal(await page.evaluate(() => window.printCalls), 1);
  await page.goto(`${url}?print`);
  assert.equal(await page.locator(".print-page").count(), 7);
  assert.equal(await page.locator(".frame").isVisible(), false);
  assert.equal(await page.locator(".print-page").nth(0).locator('[fill="url(#print-0-checker)"]').count(), 2);
  await page.screenshot({ path: `${root}/print-preview.png` });
  assert.deepEqual(errors, []);

  const extreme = await context.newPage();
  await extreme.addInitScript(() => Object.defineProperty(window, "DECK_CONFIG", {
    configurable: true,
    set(config) {
      config.funding.items.forEach((item, i) => { item.percent = i === 0 ? 100 : 0; });
      config.funding.amount = 1000000000;
      Object.defineProperty(window, "DECK_CONFIG", { value: config, writable: true, configurable: true });
    }
  }));
  await extreme.goto(url);
  await extreme.evaluate(() => MeterSeDeck.jump(5));
  assert.equal(await extreme.locator("#trail-0").evaluate(el => parseFloat(getComputedStyle(el).height)), 420);
  assert.ok(await extreme.locator("#fund-label-0").evaluate(el => el.getBoundingClientRect().bottom) < 1000);
  const amountRight = await extreme.locator("#fund-value").evaluate(el => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().right;
  });
  assert.ok(amountRight < 1060);
  await extreme.close();

  const invalid = await context.newPage();
  await invalid.addInitScript(() => Object.defineProperty(window, "DECK_CONFIG", {
    configurable: true,
    set(config) {
      config.team.members.pop();
      Object.defineProperty(window, "DECK_CONFIG", { value: config, writable: true, configurable: true });
    }
  }));
  await invalid.goto(url);
  assert.equal(await invalid.locator("#fatal").isVisible(), true);
  assert.match(await invalid.locator("#fatal").textContent(), /Check config.js/);
  await invalid.close();
  await page.goto(url);
  await page.waitForTimeout(1800);
  const reversibility = await page.evaluate(() => {
    const snapshots = [];
    const snapshot = () => ({ world: ["x", "y", "scale"].map(property => gsap.getProperty("#world", property)), actors: [...document.querySelectorAll(".vehicle")].map(element => element.getAttribute("style")), reveals: [...document.querySelectorAll(".reveal")].map(element => getComputedStyle(element).opacity), blueprint: ["#bp-chassis", "#bp-engine", "#bp-left", "#bp-right"].map(selector => gsap.getProperty(selector, "x")) });
    snapshots.push(snapshot());
    for (let index = 1; index < MeterSeDeck.states.length; index++) { MeterSeDeck.next(); MeterSeDeck.settle(); snapshots.push(snapshot()); }
    for (let index = snapshots.length - 2; index >= 0; index--) {
      MeterSeDeck.previous();
      if (JSON.stringify(snapshot()) !== JSON.stringify(snapshots[index])) return { mismatch: index, expected: snapshots[index], actual: snapshot() };
    }
    return { passed: snapshots.length };
  });
  assert.ok(reversibility.passed, JSON.stringify(reversibility));
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (let slide = 0; slide < 7; slide++) {
      await page.evaluate(index => MeterSeDeck.jump(index), slide);
      const bounds = await page.locator("#stage").boundingBox();
      assert.ok(bounds.x >= -.1 && bounds.y >= -.1 && bounds.x + bounds.width <= viewport.width + .1 && bounds.y + bounds.height <= viewport.height + .1);
      const overflow = await page.locator(`#slide-${slide} [data-ppt-text]`).evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2).map(element => element.textContent));
      assert.deepEqual(overflow, []);
    }
    await page.screenshot({ path: `${root}/${viewport.width}-finish.png` });
  }
  assert.deepEqual(errors, []);
  console.log("PASS: offline loading; fast clicks; forward/back; all scenes; proportional allocations; overview; presenter; seven-page PDF; zero browser errors");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); });