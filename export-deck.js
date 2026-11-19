const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const PptxGenJS = require("pptxgenjs");
const archiver = require("archiver");
const { createWriteStream } = require("node:fs");
const root = __dirname;

async function launchBrowser() {
  try { return await chromium.launch({ headless: true }); }
  catch { return chromium.launch({ channel: "msedge", headless: true }); }
}

async function bundle() {
  const vendor = path.join(root, "vendor");
  await fs.mkdir(vendor, { recursive: true });
  await fs.mkdir(path.join(vendor, "desktop-fonts"), { recursive: true });
  for (const name of ["gsap", "DrawSVGPlugin", "SplitText", "CustomEase", "MotionPathPlugin"]) {
    await fs.copyFile(require.resolve(`gsap/dist/${name}.min.js`), path.join(vendor, `${name}.min.js`));
  }
  for (const family of ["inter", "poppins"]) {
    const packageRoot = path.dirname(require.resolve(`@fontsource/${family}/package.json`));
    for (const weight of [400, 500, 600, 700]) {
      const name = `${family}-latin-${weight}-normal.woff2`;
      await fs.copyFile(path.join(packageRoot, "files", name), path.join(vendor, name));
      const font = await require("wawoff2").decompress(await fs.readFile(path.join(vendor, name)));
      await fs.writeFile(path.join(vendor, "desktop-fonts", `${family}-${weight}.ttf`), font);
    }
    await fs.copyFile(path.join(packageRoot, "LICENSE"), path.join(vendor, `${family}-LICENSE.txt`));
  }
  await fs.copyFile(path.join(path.dirname(require.resolve("gsap/package.json")), "README.md"), path.join(vendor, "GSAP-README.md"));
  try { await fs.access(path.join(root, "1406.jpg")); }
  catch {
    const browser = await launchBrowser();
    try {
      const page = await browser.newPage({ viewport: { width: 366, height: 366 }, deviceScaleFactor: 2 });
      await page.goto(pathToFileURL(path.join(root, "logo-source.html")).href);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(root, "1406.jpg"), type: "jpeg", quality: 98 });
    } finally { await browser.close(); }
  }
  console.log("Bundled GSAP 3.15.1, eight local fonts, licenses, and logo.");
}

async function exportDeck() {
  await bundle();
  const output = path.join(root, "downloads");
  await fs.mkdir(output, { recursive: true });
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("requestfailed", request => errors.push(request.url()));
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.MeterSeDeck && gsap.getProperty(".hero-logo", "opacity") === 1);
    await page.waitForTimeout(1700);
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "MeterSe";
    pptx.subject = "Editable-text investor presentation. Full motion in the HTML edition.";
    pptx.title = "MeterSe | Scan and Go.";
    pptx.company = "MeterSe";
    pptx.lang = "en-US";
    pptx.theme = { headFontFace: "Poppins", bodyFontFace: "Inter", lang: "en-US" };
    const slides = await page.evaluate(() => DECK_CONFIG.slides);
    for (let index = 0; index < slides.length; index++) {
      await page.evaluate(slide => MeterSeDeck.jump(slide), index);
      await page.addStyleTag({ content: ".chrome{visibility:hidden!important}body{cursor:none!important}" });
      const editable = await page.locator(`#slide-${index} [data-ppt-text]`).evaluateAll(elements => elements.map(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        let opacity = 1;
        let rotation = 0;
        for (let parent = element; parent && !parent.classList.contains("world"); parent = parent.parentElement) {
          const parentStyle = getComputedStyle(parent);
          opacity *= Number(parentStyle.opacity);
          if (parentStyle.transform !== "none") { const matrix = new DOMMatrix(parentStyle.transform); rotation += Math.atan2(matrix.b, matrix.a) * 180 / Math.PI; }
        }
        const paddingLeft = parseFloat(style.paddingLeft), paddingRight = parseFloat(style.paddingRight);
        const paddingTop = parseFloat(style.paddingTop), paddingBottom = parseFloat(style.paddingBottom);
        const range = document.createRange(); range.selectNodeContents(element);
        const singleLine = range.getClientRects().length === 1;
        return { text: element.textContent, x: rect.x + (rect.width - element.offsetWidth) / 2 + paddingLeft, y: rect.y + (rect.height - element.offsetHeight) / 2 + paddingTop, width: element.clientWidth - paddingLeft - paddingRight, height: element.clientHeight - paddingTop - paddingBottom, font: style.fontFamily.split(",")[0].replace(/["']/g, ""), size: parseFloat(style.fontSize), bold: Number(style.fontWeight) >= 600, color: style.color, align: style.textAlign, opacity, rotation, singleLine, lineHeight: parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2 };
      }));
      await page.screenshot({ path: path.join(output, `slide-${index + 1}.png`) });
      const hideText = await page.addStyleTag({ content: "[data-ppt-text]{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}" });
      const background = await page.screenshot();
      await hideText.evaluate(element => element.remove());
      const slide = pptx.addSlide();
      slide.background = { color: "151921" };
      slide.addImage({ data: `image/png;base64,${background.toString("base64")}`, x: 0, y: 0, w: 13.333333, h: 7.5 });
      for (const item of editable) {
        if (!item.text || item.opacity < .01) continue;
        const channels = item.color.match(/[\d.]+/g).slice(0, 3).map(Number);
        const color = channels.map(value => Math.round(value * item.opacity + 21 * (1 - item.opacity)).toString(16).padStart(2, "0")).join("");
        slide.addText(item.text, {
          x: item.x / 144, y: item.y / 144, w: (item.width + (item.singleLine ? 4 : 0)) / 144, h: Math.max(item.height, item.lineHeight) / 144,
          fontFace: item.font, fontSize: item.size / 2, bold: item.bold, color,
          align: ["left", "right", "center", "justify"].includes(item.align) ? item.align : "left", valign: "top",
          margin: 0, breakLine: false, paraSpaceAfterPt: 0, fit: "shrink", wrap: !item.singleLine, rotate: (item.rotation + 360) % 360, lineSpacingMultiple: item.lineHeight / item.size
        });
      }
      slide.addNotes(`${slides[index].notes}\n\nFull click-driven animation is provided in index.html. PowerPoint artwork is a slide background; text remains editable.`);
    }
    await pptx.writeFile({ fileName: path.join(output, "MeterSe-Editable.pptx") });
    await page.evaluate(() => MeterSeDeck.preparePrint());
    await page.pdf({ path: path.join(output, "MeterSe-Deck.pdf"), printBackground: true, preferCSSPageSize: true });
    if (errors.length) throw new Error(errors.join("\n"));
  } finally { await browser.close(); }
  await new Promise((resolve, reject) => {
    const stream = createWriteStream(path.join(output, "MeterSe-Complete.zip"));
    const archive = archiver("zip", { zlib: { level: 9 } });
    stream.on("close", resolve); stream.on("error", reject); archive.on("error", reject); archive.pipe(stream);
    for (const file of ["index.html", "styles.css", "config.js", "deck.js", "1406.jpg", "app-screen.png", "README.txt", "logo-source.html", "package.json", "package-lock.json", "deck-tests.js", "export-deck.js"]) archive.file(path.join(root, file), { name: `MeterSe/${file}` });
    archive.directory(path.join(root, "vendor"), "MeterSe/vendor");
    archive.file(path.join(output, "MeterSe-Editable.pptx"), { name: "MeterSe/MeterSe-Editable.pptx" });
    archive.file(path.join(output, "MeterSe-Deck.pdf"), { name: "MeterSe/MeterSe-Deck.pdf" });
    archive.finalize();
  });
  console.log("Exported downloads/MeterSe-Editable.pptx, MeterSe-Deck.pdf, and MeterSe-Complete.zip");
}

if (require.main === module) {
  (process.argv.includes("--bundle") ? bundle() : exportDeck()).catch(error => { console.error(error); process.exitCode = 1; });
}
module.exports = { launchBrowser, bundle };