(function () {
  "use strict";
  const config = window.DECK_CONFIG;
  const fatal = document.querySelector("#fatal");
  function fail(message) { fatal.hidden = false; fatal.textContent = message; }
  if (!window.gsap || !window.DrawSVGPlugin || !window.SplitText || !window.CustomEase || !window.MotionPathPlugin) {
    fail(config?.ui.dependencyError || "The bundled animation libraries are missing.");
    return;
  }
  const valid = config && config.slides.length === 7 && config.team.members.length === 4 &&
    config.brand.facts.length === 3 && config.problem.items.length === 3 && config.solution.items.length === 3 &&
    config.tech.items.length === 4 && config.funding.items.length === 5 &&
    config.funding.items.every(item => Number.isFinite(item.percent) && item.percent >= 0 && /^#[\da-f]{6}$/i.test(item.color)) &&
    Math.abs(config.funding.items.reduce((sum, item) => sum + item.percent, 0) - 100) < .001 &&
    Number.isFinite(config.funding.amount) && config.funding.amount >= 0;
  if (!valid) { fail(config?.ui.configError || "Check config.js."); return; }
  gsap.registerPlugin(DrawSVGPlugin, SplitText, CustomEase, MotionPathPlugin);
  CustomEase.create("drive", "0.25,0.1,0.25,1");
  const WIDTH = 1920, HEIGHT = 1080, STRIDE = 1680, WORLD_HEIGHT = 11160;
  const stage = document.querySelector("#stage");
  const world = document.querySelector("#world");
  const roadXs = [1380, 420, 1380, 420, 1380, 960, 960];
  const stepCounts = [4, 4, 3, 3, 5, 6, 0];
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const text = (tag, value, attributes = "") => `<${tag} data-ppt-text ${attributes}>${escape(value)}</${tag}>`;
  const svg = content => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 160" aria-hidden="true">${content}</svg>`;
  function vehicle(type, color = "#3b82f6") {
    if (type === "bike") return svg('<ellipse cx="50" cy="30" rx="8" ry="25" fill="#10151f" stroke="#b6c8dd" stroke-width="4"/><ellipse cx="50" cy="130" rx="8" ry="25" fill="#10151f" stroke="#b6c8dd" stroke-width="4"/><path d="M50 30V132M23 112H77M30 68L50 40L70 68" fill="none" stroke="#64a8ff" stroke-width="7"/><ellipse cx="50" cy="68" rx="19" ry="27" fill="#e2e8f0"/><circle cx="50" cy="94" r="14" fill="#3b82f6"/><path d="M24 111L30 80M76 111L70 80" stroke="#d7b69a" stroke-width="7" stroke-linecap="round"/>');
    const wheels = (type === "old" ? '<g class="exhaust" opacity="0" fill="#9d9990"><circle cx="30" cy="-7" r="10"/><circle cx="20" cy="-24" r="16"/><circle cx="35" cy="-46" r="21"/></g>' : '') + '<g fill="#080d14" stroke="#566173" stroke-width="2"><rect x="1" y="23" width="17" height="34" rx="5"/><rect x="82" y="23" width="17" height="34" rx="5"/><rect x="1" y="108" width="17" height="34" rx="5"/><rect x="82" y="108" width="17" height="34" rx="5"/></g>';
    if (type === "f1") return svg(`${wheels}<path d="M40 12H60L66 59L62 99L58 140H42L38 99L34 59Z" fill="${color}" stroke="#d5edff" stroke-width="2"/><rect x="16" y="8" width="68" height="14" rx="2" fill="${color}"/><rect x="11" y="137" width="78" height="15" rx="2" fill="${color}"/><ellipse cx="50" cy="77" rx="13" ry="22" fill="#101722"/><circle cx="50" cy="85" r="8" fill="#f2d164"/><path d="M30 35L41 58M70 35L59 58M26 122L42 106M74 122L58 106" stroke="#94a3b8" stroke-width="5"/>`);
    const paint = type === "old" ? "#9b6951" : type === "jeep" ? "#d2ba77" : type === "ev" ? "#d9fff3" : color;
    const riders = Array.from({ length: 4 }, (_, index) => `<g class="rider rider-${index}" opacity="0" transform="translate(${index % 2 ? 66 : 34} ${index < 2 ? 54 : 86})"><ellipse cy="4" rx="10" ry="12" fill="#3b82f6"/><circle cy="-4" r="7" fill="#ecc5a1"/></g>`).join("");
    return svg(`${wheels}<rect x="14" y="7" width="72" height="146" rx="${type === "jeep" ? 9 : 25}" fill="${paint}" stroke="#d8e6f4" stroke-width="2"/><path d="M24 44Q50 34 76 44L71 67H29Z" fill="#20384a"/><path d="M29 91H71L77 112Q50 122 23 112Z" fill="#20384a"/>${type === "jeep" ? `<rect x="24" y="32" width="52" height="72" rx="5" fill="#2a3036"/>${riders}<path d="M21 71H79" stroke="#899387" stroke-width="4"/>` : '<rect x="27" y="65" width="46" height="29" rx="8" fill="#ffffff20"/>'}<path d="M23 138H36M64 138H77" stroke="#faffd3" stroke-width="6" stroke-linecap="round"/><path d="M24 18H36M64 18H76" stroke="#fb7185" stroke-width="4"/>${type === "old" ? '<path d="M22 30l15 5-9 12M69 121l9 8-12 5M49 73l11 9" stroke="#533f36" stroke-width="4"/>' : ''}${type === "ev" ? '<path d="M37 129H63" stroke="#34d399" stroke-width="3"/>' : ''}`);
  }
  let roadPath = "M1380 540 L1380 1080";
  for (let index = 1; index < 7; index++) {
    const previousBottom = (index - 1) * STRIDE + HEIGHT;
    const nextTop = index * STRIDE;
    roadPath += ` C${roadXs[index - 1]} ${previousBottom + 300} ${roadXs[index]} ${nextTop - 300} ${roadXs[index]} ${nextTop} L${roadXs[index]} ${nextTop + (index === 6 ? 889 : HEIGHT)}`;
  }
  const city = Array.from({ length: 7 }, (_, index) => `<rect x="0" y="${index * STRIDE}" width="1920" height="1680" fill="${["#151921", "#151d25", "#241c23", "#122820", "#112831", "#151921", "#151921"][index]}"/><rect x="0" y="${index * STRIDE}" width="1920" height="1680" fill="url(#${index === 4 ? "bluegrid" : "citygrid"})"/>`).join("");
  document.querySelector("#map").setAttribute("viewBox", `0 0 ${WIDTH} ${WORLD_HEIGHT}`);
  document.querySelector("#map").innerHTML = `<defs><pattern id="citygrid" width="160" height="160" patternUnits="userSpaceOnUse"><path d="M0 0H160V160" fill="none" stroke="#94a3b8" stroke-opacity=".055"/><rect x="25" y="27" width="100" height="100" rx="8" fill="none" stroke="#94a3b8" stroke-opacity=".035"/></pattern><pattern id="bluegrid" width="45" height="45" patternUnits="userSpaceOnUse"><path d="M0 0H45V45" fill="none" stroke="#67e8f9" stroke-opacity=".1"/></pattern><pattern id="checker" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="#eaf0f9"/><path d="M0 0H18V18H0ZM18 18H36V36H18Z" fill="#18202b"/></pattern><mask id="road-mask"><path id="road-reveal" d="${roadPath}" stroke="white" stroke-width="220" fill="none"/></mask></defs>${city}<g mask="url(#road-mask)"><path d="${roadPath}" fill="none" stroke="#364253" stroke-width="194"/><path d="${roadPath}" fill="none" stroke="#1e2638" stroke-width="180"/><path id="road-center" d="${roadPath}" fill="none" stroke="#e9b65b" stroke-width="4" stroke-dasharray="20 24"/></g><rect x="1286" y="595" width="188" height="54" fill="url(#checker)"/><rect x="866" y="10915" width="188" height="54" fill="url(#checker)"/>`;
  const heading = (section, side) => `<header class="section-head ${side}">${text("div", section.eyebrow, 'class="eyebrow"')}${text("h1", section.heading)}${text("p", section.subheading)}</header>`;
  const markup = [];
  markup.push(`<div class="hero"><img class="hero-logo" src="${escape(config.brand.logo)}" alt="${escape(config.brand.name)}">${text("div", config.brand.tagline, 'class="hero-tagline"')}${text("div", config.intro.kicker, 'class="hero-kicker"')}</div><div class="intro-copy glass reveal">${text("div", config.intro.introLabel, 'class="small-label"')}${text("h2", config.intro.heading)}${text("p", config.brand.intro)}</div><div class="intro-facts">${config.brand.facts.map(value => text("div", value, 'class="intro-fact glass reveal"')).join("")}</div><div class="traffic"><i class="light red"></i><i class="light amber"></i><i class="light green"></i></div>${text("div", config.ui.start, 'class="road-caption" style="left:1290px;top:545px"')}`);
  markup.push(`${heading(config.team, "right")}${config.team.members.map((member, index) => `<div class="team-card glass reveal" style="left:${735 + index % 2 * 445}px;top:${355 + Math.floor(index / 2) * 245}px"><div class="team-avatar">${String(index + 1).padStart(2, "0")}</div><div>${text("h3", member.name)}${text("div", member.role, 'class="role"')}${text("p", member.credential)}</div></div><div class="bus-stop" style="left:550px;top:${340 + index * 175}px"><svg viewBox="0 0 60 52"><rect x="5" y="2" width="48" height="40" rx="6" fill="#1e3c5a" stroke="#8abbff"/><path d="M17 13H41V28H17ZM20 33H23M35 33H38" fill="none" stroke="#d8eaff" stroke-width="3"/></svg></div>`).join("")}`);
  markup.push(`${heading(config.problem, "left")}${config.problem.items.map((item, index) => `<div class="story-card problem-card glass reveal" style="top:${345 + index * 185}px"><div class="story-icon">!</div><div>${text("h3", item.title)}${text("p", item.detail)}</div></div><div class="obstacle reveal" id="obstacle-${index}" style="left:1315px;top:${STRIDE * 0 + 300 + index * 210}px"><svg viewBox="0 0 130 100">${index % 2 ? '<path d="M12 30H118V61H12Z" fill="#eaae56"/><path d="M20 30l30 31M60 30l30 31M100 30l18 18" stroke="#3b3028" stroke-width="12"/><path d="M27 61V91M103 61V91" stroke="#9ca3af" stroke-width="7"/>' : '<ellipse cx="65" cy="60" rx="45" ry="23" fill="#0e121b" stroke="#70564b" stroke-width="5"/>'}</svg></div><div class="dust" id="dust-${index}" style="left:1315px;top:${300 + index * 210}px"><svg viewBox="0 0 130 100"><g fill="#b9aa96" opacity=".55"><circle cx="30" cy="50" r="24"/><circle cx="80" cy="40" r="29"/><circle cx="65" cy="75" r="20"/></g></svg></div>`).join("")}`);
  markup.push(`${heading(config.solution, "right")}<div class="ev-trail" id="ev-trail"></div>${config.solution.items.map((item, index) => `<div class="story-card solution-card glass reveal" style="top:${345 + index * 185}px"><div class="story-icon">&#10003;</div><div>${text("h3", item.title)}${text("p", item.detail)}</div></div>`).join("")}${config.solution.showMockup ? `<div class="mockup reveal"><div class="mockup-top"></div><div class="mockup-screen${config.solution.mockupImage ? " has-image" : ""}">${config.solution.mockupImage ? `<img class="mockup-img" src="${escape(config.solution.mockupImage)}" alt="${escape(config.solution.mockupTitle)}">` : `${text("strong", config.solution.mockupTitle)}${config.solution.mockupRows.map(row => text("div", row, 'class="mockup-row"')).join("")}`}</div></div>${text("div", config.solution.mockupLabel, 'class="mockup-caption reveal"')}` : ""}`);
  markup.push(`${heading(config.tech, "left")}<div class="blueprint-wrap"><svg viewBox="0 0 400 560" fill="none" stroke="#67e8f9" stroke-width="3"><g id="bp-chassis"><path d="M165 40H235L260 175L240 400L222 510H178L160 400L140 175Z"/><path d="M130 32H270V65H130ZM110 480H290V520H110Z"/><path d="M185 70V160M215 70V160M185 360V475M215 360V475" stroke-dasharray="8 8"/></g><g id="bp-engine"><rect x="175" y="195" width="50" height="140" rx="14"/><path d="M181 220H219M181 240H219M181 260H219M181 280H219"/></g><g id="bp-left"><rect x="80" y="105" width="54" height="95" rx="10"/><rect x="80" y="355" width="54" height="105" rx="10"/><path d="M134 150H165M134 405H170"/></g><g id="bp-right"><rect x="266" y="105" width="54" height="95" rx="10"/><rect x="266" y="355" width="54" height="105" rx="10"/><path d="M235 150H266M230 405H266"/></g><g id="bp-lights" opacity="0" fill="#e1ffff" stroke="none"><path d="M145 500L100 560H180ZM255 500L220 560H300Z"/></g></svg></div>${config.tech.items.map((item, index) => `<div class="tech-card glass reveal" style="top:${345 + index * 130}px">${text("h3", item.title)}${text("p", item.detail)}</div>`).join("")}<div class="tech-logos reveal">${config.tech.items.map(item => text("div", item.logo, 'class="tech-logo"')).join("")}</div>`);
  markup.push(`<div class="highway"><div class="highway-lanes">${config.funding.items.map(() => '<div></div>').join("")}</div></div><div class="fund-heading">${text("div", config.funding.eyebrow, 'class="eyebrow"')}${text("h1", config.funding.heading)}${text("div", "", 'class="fund-value" id="fund-value"')}${text("div", config.funding.amountNote, 'class="fund-note"')}</div>${text("div", config.funding.allocationNote, 'class="allocation-note"')}${config.funding.items.map((item, index) => `<div class="fund-trail" id="trail-${index}" style="left:${480 + index * 240}px;top:365px;height:0;color:${item.color};background:${item.color}"></div><div class="fund-label reveal" id="fund-label-${index}" style="left:${480 + index * 240}px;top:900px">${text("strong", `${item.percent}%`, `style="color:${item.color}"`)}${text("span", item.category)}</div>`).join("")}`);
  markup.push(`<div class="thanks-copy">${text("div", config.thanks.eyebrow, 'class="eyebrow"')}${text("h1", config.thanks.heading)}${text("p", config.thanks.subheading)}</div><div class="contact glass">${text("div", config.thanks.contactLabel, 'class="small-label"')}${text("p", config.thanks.contact)}</div>${text("div", config.ui.finish, 'class="road-caption" style="left:870px;top:920px"')}${Array.from({ length: 55 }, (_, index) => `<i class="confetti" style="left:${800 + (index * 127 % 900)}px;top:520px;background:${["#60a5fa", "#34d399", "#fbbf24", "#fb7185", "#ffffff"][index % 5]}"></i>`).join("")}`);
  document.querySelector("#slides").innerHTML = markup.map((content, index) => `<section class="slide" id="slide-${index}" style="top:${index * STRIDE}px" aria-label="${escape(config.slides[index].title)}">${content}<button class="scene-hit" data-jump="${index}" aria-label="${escape(config.slides[index].title)}"></button></section>`).join("");
  document.querySelector("#actors").innerHTML = ["bike", "jeep", "old", "ev", "f1"].map(type => `<div class="vehicle ${type} route-${type}">${vehicle(type)}</div>`).join("") + ["bike", "jeep", "restored", "ev", "f1"].map((type, index) => `<div id="convoy-${index}" class="vehicle ${type} convoy finish-car">${vehicle(type, config.funding.items[index].color)}</div>`).join("");
  document.querySelector("#tunnels").innerHTML = Array.from({ length: 6 }, (_, index) => `<div class="tunnel" style="left:${(roadXs[index] + roadXs[index + 1]) / 2 - 143}px;top:${index * STRIDE + HEIGHT + 205}px"><div class="tunnel-shell"></div>${text("div", config.ui.upgrade, 'class="tunnel-label"')}</div>`).join("");
  const rawPath = MotionPathPlugin.stringToRawPath(roadPath);
  MotionPathPlugin.cacheRawPathMeasurements(rawPath, 30);
  function progressAtY(target) {
    let low = 0, high = 1;
    for (let count = 0; count < 26; count++) {
      const middle = (low + high) / 2;
      if (MotionPathPlugin.getPositionOnPath(rawPath, middle).y < target) low = middle;
      else high = middle;
    }
    return Math.round((low + high) / 2 * 1000000) / 1000000;
  }
  const routeTypes = ["bike", "jeep", "old", "ev", "f1"];
  const routes = routeTypes.map((type, index) => ({ element: document.querySelector(`.route-${type}`), progress: progressAtY(index ? index * STRIDE - 300 : 690) }));
  routes.forEach(route => { route.setX = gsap.quickSetter(route.element, "x", "px"); route.setY = gsap.quickSetter(route.element, "y", "px"); route.setRotation = gsap.quickSetter(route.element, "rotation", "deg"); });
  gsap.set(".vehicle", { xPercent: -50, yPercent: -50, opacity: 1 });
  gsap.set(".vehicle:not(.route-bike),.dust", { opacity: 0 });
  gsap.set(".convoy", { y: STRIDE * 5 + 365 });
  config.funding.items.forEach((item, index) => gsap.set(`#convoy-${index}`, { x: 480 + index * 240 }));
  const fundingCounter = { amount: 0 };
  let currency;
  try { currency = new Intl.NumberFormat("en-US", { style: "currency", currency: config.funding.currency, maximumFractionDigits: 0 }); }
  catch { fail(config.ui.configError); return; }
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "drive" } });
  const states = [];
  function label(slide, step, overview = false) {
    const name = overview ? "overview" : `slide-${slide}-step-${step}`;
    timeline.addLabel(name);
    states.push({ slide, step, overview, label: name, time: timeline.duration() });
  }
  function reveal(target, position) { timeline.fromTo(target, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5, immediateRender: false }, position); }
  function drive(index, localY, position, duration = .85) { timeline.to(routes[index], { progress: progressAtY(index * STRIDE + localY), duration }, position); }
  timeline.set(world, { x: 0, y: 0, scale: 1 }, 0);
  label(0, 0);
  for (let step = 1; step <= 4; step++) {
    const start = timeline.duration();
    drive(0, 690 + step * 70, start);
    if (step === 1) { timeline.to(".light.red", { opacity: .2, duration: .2 }, start); timeline.to(".light.green", { opacity: 1, duration: .2 }, start); }
    reveal(step === 1 ? ".intro-copy" : `.intro-fact:nth-child(${step - 1})`, start + .15);
    label(0, step);
  }
  function transition(slide) {
    const start = timeline.duration();
    const previous = slide - 1;
    if (previous < 5) {
      drive(previous, 1080 + 300, start, 1.1);
      timeline.to(routes[previous].element, { opacity: 0, duration: .12 }, start + 1.0);
    }
    timeline.to(world, { y: -slide * STRIDE, duration: 1.5, ease: "power2.inOut" }, start + .65);
    if (slide < 5) {
      timeline.to(routes[slide].element, { opacity: 1, duration: .12 }, start + 1.12);
      drive(slide, 160, start + 1.1, 1.05);
    } else if (slide === 5) {
      config.funding.items.forEach((item, index) => {
        timeline.fromTo(`#convoy-${index}`, { x: 1170, y: slide * STRIDE - 300, opacity: 0 }, { x: 480 + index * 240, y: slide * STRIDE + 365, opacity: 1, duration: 1.1, immediateRender: false }, start + 1.05);
      });
    } else {
      config.funding.items.forEach((item, index) => {
        timeline.to(`#convoy-${index}`, { x: 960, y: slide * STRIDE - 250, rotation: 0, duration: 1.0 }, start);
        timeline.to(`#convoy-${index}`, { x: 1010 + index * 145, y: slide * STRIDE + 670 + Math.abs(index - 2) * 45, rotation: (index - 2) * -13, duration: 1.15 }, start + 1);
      });
      timeline.fromTo(".confetti", { opacity: 0, y: 0, rotation: 0 }, { opacity: 1, y: index => -360 + index * 73 % 660, x: index => -150 + index * 37 % 300, rotation: index => index * 41, duration: .9, ease: "power2.out", immediateRender: false }, start + 1.35);
    }
    label(slide, 0);
  }
  transition(1);
  for (let step = 1; step <= 4; step++) {
    const start = timeline.duration();
    drive(1, 340 + (step - 1) * 175, start);
    reveal(document.querySelectorAll(".team-card")[step - 1], start + .15);
    timeline.fromTo(`.route-jeep .rider-${step - 1}`, { opacity: 0, scale: .2 }, { opacity: 1, scale: 1, duration: .35, transformOrigin: "center", immediateRender: false, ease: "back.out(2)" }, start + .5);
    label(1, step);
  }
  transition(2);
  for (let step = 1; step <= 3; step++) {
    const start = timeline.duration();
    reveal(`#obstacle-${step - 1}`, start);
    drive(2, 360 + (step - 1) * 210, start, .75);
    timeline.fromTo(".route-old .exhaust", { opacity: 0, y: 0, scale: .4 }, { opacity: .5, y: -25, scale: 1.4, duration: .22, repeat: 3, yoyo: true, immediateRender: false }, start);
    timeline.to(`.route-old svg`, { x: 7, duration: .06, repeat: 5, yoyo: true, ease: "none" }, start + .65);
    timeline.fromTo(`#dust-${step - 1}`, { opacity: .65, scale: .3 }, { opacity: 0, scale: 1.8, duration: .65, immediateRender: false }, start + .7);
    reveal(document.querySelectorAll(".problem-card")[step - 1], start + .4);
    if (step > 1) timeline.to(document.querySelectorAll(".problem-card")[step - 2], { opacity: .55, duration: .25 }, start);
    label(2, step);
  }
  transition(3);
  for (let step = 1; step <= 3; step++) {
    const start = timeline.duration();
    drive(3, 360 + (step - 1) * 220, start);
    reveal(`.solution-card:nth-of-type(${step + 1})`, start + .15);
    if (step === 1 && config.solution.showMockup) { reveal(".mockup,.mockup-caption", start + .2); timeline.fromTo(".mockup", { rotation: -12 }, { rotation: 5, duration: .65, immediateRender: false }, start + .2); }
    label(3, step);
  }
  transition(4);
  const blueprintParts = ["#bp-chassis", "#bp-engine", "#bp-left", "#bp-right"];
  for (let step = 1; step <= 5; step++) {
    const start = timeline.duration();
    drive(4, 160 + step * 145, start);
    if (step < 5) {
      reveal(`.tech-card:nth-of-type(${step + 1})`, start + .1);
      timeline.to(blueprintParts[step - 1], { x: [-55, 75, -65, 65][step - 1], duration: .6 }, start);
    } else {
      timeline.to(blueprintParts, { x: 0, duration: .7, ease: "bounce.out" }, start);
      timeline.to("#bp-lights", { opacity: 1, duration: .12, repeat: 3, yoyo: true }, start + .65);
      timeline.to(".blueprint-wrap", { scale: .35, y: 260, opacity: 0, duration: .65 }, start + 1.1);
      reveal(".tech-logos", start + 1.5);
    }
    label(4, step);
  }
  transition(5);
  const fundingStart = timeline.duration();
  timeline.to(fundingCounter, { amount: config.funding.amount, duration: 1.2, ease: "power2.out" }, fundingStart);
  label(5, 1);
  const allocationScale = Math.min(10, 420 / Math.max(...config.funding.items.map(item => item.percent)));
  config.funding.items.forEach((item, index) => {
    const start = timeline.duration();
    const distance = item.percent * allocationScale;
    timeline.to(`#convoy-${index}`, { y: STRIDE * 5 + 365 + distance, duration: .9 }, start);
    timeline.to(`#trail-${index}`, { height: distance, duration: .9 }, start);
    reveal(`#fund-label-${index}`, start + .25);
    label(5, index + 2);
  });
  transition(6);
  const overviewStart = timeline.duration();
  timeline.to(world, { x: 660, y: 36, scale: .09, duration: 1.5, ease: "power2.inOut" }, overviewStart);
  timeline.to(".overview", { autoAlpha: 1, duration: .5 }, overviewStart + 1);
  label(6, 1, true);
  let stateIndex = 0;
  let navigationTween;
  let introAnimation;
  let presenterWindow;
  let timerStart = Date.now();
  let timerInterval;
  let cursorTimer;
  let lastAmount;
  let lastCameraY;
  let lastEvProgress;
  const minimap = document.querySelector("#minimap");
  minimap.innerHTML = `<path d="${roadPath}" fill="none" stroke="#7189aa" stroke-width="42"/><circle id="gps-dot" r="92" fill="#60a5fa" stroke="#e0eeff" stroke-width="22"/>`;
  const gpsDot = document.querySelector("#gps-dot");
  const evTrail = document.querySelector("#ev-trail");
  function render() {
    routes.forEach(route => {
      if (route.lastProgress === route.progress) return;
      const point = MotionPathPlugin.getPositionOnPath(rawPath, route.progress, true);
      route.setX(point.x); route.setY(point.y); route.setRotation(point.angle - 90);
      route.lastProgress = route.progress;
    });
    if (lastEvProgress !== routes[3].progress) {
      const evPoint = MotionPathPlugin.getPositionOnPath(rawPath, routes[3].progress);
      evTrail.style.transform = `scaleY(${Math.max(0, Math.min(920, evPoint.y - STRIDE * 3 - 160)) / 920})`;
      lastEvProgress = routes[3].progress;
    }
    const cameraY = -Number(gsap.getProperty(world, "y")) + 540;
    if (lastCameraY !== cameraY) {
      const gps = MotionPathPlugin.getPositionOnPath(rawPath, progressAtY(cameraY));
      gpsDot.setAttribute("cx", gps.x); gpsDot.setAttribute("cy", gps.y);
      lastCameraY = cameraY;
    }
    const amount = Math.round(fundingCounter.amount);
    if (amount !== lastAmount) { document.querySelector("#fund-value").textContent = currency.format(amount); lastAmount = amount; }
  }
  gsap.ticker.add(render);
  timeline.eventCallback("onUpdate", render);
  function current() { return states[stateIndex]; }
  function stepTitle(state) {
    if (!state) return config.ui.end;
    if (state.overview) return config.ui.overviewTitle;
    const items = [config.brand.facts, config.team.members.map(item => item.name), config.problem.items.map(item => item.title), config.solution.items.map(item => item.title), config.tech.items.map(item => item.title), [config.funding.heading, ...config.funding.items.map(item => item.category]], []];
    if (state.slide === 0 && state.step === 1) return config.brand.intro;
    return items[state.slide][state.step - (state.slide === 0 ? 2 : 1)] || config.slides[state.slide].title;
  }
  function updatePresenter() {
    if (!presenterWindow || presenterWindow.closed) { clearInterval(timerInterval); return; }
    const doc = presenterWindow.document;
    doc.querySelector("#notes-value").textContent = config.slides[current().slide].notes;
    doc.querySelector("#current-value").textContent = stepTitle(current());
    doc.querySelector("#next-value").textContent = stepTitle(states[stateIndex + 1]);
    const elapsed = Math.floor((Date.now() - timerStart) / 1000);
    doc.querySelector("#timer-value").textContent = [Math.floor(elapsed / 3600), Math.floor(elapsed / 60) % 60, elapsed % 60].map(value => String(value).padStart(2, "0")).join(":");
  }
  function updateUI() {
    const state = current();
    stage.classList.toggle("is-overview", state.overview);
    document.querySelector("#previous").disabled = stateIndex === 0;
    document.querySelector("#next").disabled = stateIndex === states.length - 1;
    document.querySelectorAll(".slide").forEach((slide, index) => { slide.inert = !state.overview && index !== state.slide; slide.setAttribute("aria-hidden", String(!state.overview && index !== state.slide)); });
    updatePresenter();
  }
  function settle() { if (introAnimation) { introAnimation.progress(1).kill(); introAnimation = null; } if (navigationTween) { navigationTween.kill(); navigationTween = null; } timeline.pause(current().time, false); render(); }
  function next() {
    settle();
    if (stateIndex === states.length - 1) return;
    stateIndex++;
    updateUI();
    navigationTween = timeline.tweenTo(current().label, { ease: "none", onComplete: render });
  }
  function previous() { settle(); stateIndex = Math.max(0, stateIndex - 1); timeline.pause(current().time, false); render(); updateUI(); }
  function jump(slide, step = stepCounts[slide]) {
    const index = states.findIndex(state => state.slide === slide && state.step === step && !state.overview);
    if (index < 0) return;
    settle(); stateIndex = index; timeline.pause(current().time, false); render(); updateUI();
  }
  function status(message) {
    const element = document.querySelector("#status"); element.textContent = message; element.classList.add("visible");
    gsap.delayedCall(5, () => element.classList.remove("visible"));
  }
  function openPresenter() {
    if (presenterWindow && !presenterWindow.closed) { presenterWindow.focus(); return; }
    presenterWindow = window.open("about:blank", "MeterSePresenter", "width=900,height=700");
    if (!presenterWindow) { status(config.ui.popupBlocked); return; }
    const doc = presenterWindow.document;
    doc.open();
    doc.write(`<!doctype html><html><head><title>${escape(config.ui.presenterTitle)}</title><style>body{background:#151921;color:#fff;font:20px/1.5 sans-serif;padding:32px}h2{font-size:13px;color:#93b9f4;letter-spacing:2px;margin-top:30px}#timer-value{font-size:32px;font-variant-numeric:tabular-nums}button{background:#25354a;color:white;border:1px solid #6c85a5;border-radius:6px;padding:12px 20px;cursor:pointer;margin-right:10px}#notes-value{white-space:pre-wrap}</style></head><body><div id="timer-value"></div><button id="reset">${escape(config.ui.resetTimer)}</button><h2>${escape(config.ui.current)}</h2><div id="current-value"></div><h2>${escape(config.ui.upNext)}</h2><div id="next-value"></div><h2>${escape(config.ui.notes)}</h2><div id="notes-value"></div><p><button id="prev">${escape(config.ui.previous)}</button><button id="next">${escape(config.ui.next)}</button></p></body></html>`);
    doc.close();
    doc.querySelector("#prev").onclick = previous; doc.querySelector("#next").onclick = next;
    doc.querySelector("#reset").onclick = () => { timerStart = Date.now(); updatePresenter(); };
    doc.addEventListener("keydown", onKey);
    clearInterval(timerInterval); timerInterval = setInterval(updatePresenter, 500); updatePresenter();
  }
  function resize() {
    const scale = Math.min(innerWidth / WIDTH, innerHeight / HEIGHT);
    stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
    document.documentElement.style.setProperty("--print-scale", Math.min(1, (innerWidth - 48) / WIDTH));
  }
  function preparePrint() {
    settle();
    const savedIndex = stateIndex;
    const pages = document.querySelector("#print-pages"); pages.replaceChildren();
    config.slides.forEach((slide, index) => {
      jump(index);
      const page = document.createElement("div"); page.className = "print-page";
      const copy = world.cloneNode(true);
      copy.style.transform = `translate(0px, ${-index * STRIDE}px)`;
      copy.querySelectorAll(".scene-hit").forEach(element => element.remove());
      copy.querySelectorAll(".slide").forEach(element => { element.inert = false; element.removeAttribute("aria-hidden"); });
      const idMap = new Map();
      if (copy.id) { idMap.set(copy.id, `print-${index}-${copy.id}`); copy.id = idMap.get(copy.id); }
      copy.querySelectorAll("[id]").forEach(element => { idMap.set(element.id, `print-${index}-${element.id}`); element.id = idMap.get(element.id); });
      copy.querySelectorAll("*").forEach(element => [...element.attributes].forEach(attribute => {
        if (attribute.value.includes("url(#")) element.setAttribute(attribute.name, attribute.value.replace(/url\(#([^)]*)\)/g, (match, id) => `url(#${idMap.get(id) || id})`));
      }));
      page.append(copy); pages.append(page);
    });
    stateIndex = savedIndex; timeline.pause(current().time, false); render(); updateUI();
    return pages;
  }
  function printDeck() { preparePrint(); window.print(); }
  function fullscreen() {
    const operation = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    if (operation) operation.catch(() => status(config.ui.fullscreenError)); else status(config.ui.fullscreenError);
  }
  function onKey(event) {
    if (event.altKey || event.target.closest("input,textarea,select")) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") { event.preventDefault(); printDeck(); return; }
    if (event.ctrlKey || event.metaKey) return;
    if ([" ", "Enter", "PageDown", "ArrowRight", "ArrowDown"].includes(event.key)) { event.preventDefault(); next(); }
    else if (["Backspace", "PageUp", "ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); previous(); }
    else if (event.key.toLowerCase() === "p") openPresenter();
    else if (event.key.toLowerCase() === "f") fullscreen();
    else if (event.key === "Escape" && current().overview) jump(6);
  }
  document.title = config.ui.documentTitle;
  stage.setAttribute("aria-label", config.ui.presentationLabel);
  ["previous", "next", "presenter", "fullscreen", "print"].forEach(id => { const button = document.getElementById(id); button.title = config.ui[id]; button.setAttribute("aria-label", config.ui[id]); });
  const bindings = { "minimap-title": config.ui.journey, "overview-kicker": config.ui.journey, "overview-title": config.ui.overviewTitle, "overview-text": config.ui.overviewText, "overview-hint": config.ui.overviewHint };
  Object.entries(bindings).forEach(([id, value]) => { document.getElementById(id).textContent = value; });
  document.querySelector("#overview-buttons").innerHTML = config.slides.map((slide, index) => `<button class="overview-button" data-jump="${index}"><span>${String(index + 1).padStart(2, "0")}</span>${escape(slide.title)}</button>`).join("");
  document.querySelector("#previous").onclick = previous;
  document.querySelector("#next").onclick = next;
  document.querySelector("#presenter").onclick = openPresenter;
  document.querySelector("#fullscreen").onclick = fullscreen;
  document.querySelector("#print").onclick = printDeck;
  stage.addEventListener("click", event => {
    const target = event.target.closest("[data-jump]");
    if (target) { jump(Number(target.dataset.jump)); return; }
    if (event.target.closest("button,a") || current().overview) return;
    next();
  });
  document.addEventListener("keydown", onKey);
  function showCursor() { document.body.classList.remove("cursor-hidden"); clearTimeout(cursorTimer); cursorTimer = setTimeout(() => document.body.classList.add("cursor-hidden"), 2000); }
  document.addEventListener("pointermove", showCursor);
  document.addEventListener("pointerdown", showCursor);
  window.addEventListener("resize", resize);
  window.addEventListener("beforeprint", preparePrint);
  window.addEventListener("pagehide", () => { clearInterval(timerInterval); if (presenterWindow && !presenterWindow.closed) presenterWindow.close(); });
  document.querySelector(".hero-logo").addEventListener("error", () => status(config.ui.logoError));
  window.MeterSeDeck = { next, previous, jump, settle, preparePrint, timeline, states, getState: () => ({ ...current() }), vehicle, config };
  timeline.pause(0, false); resize(); render(); updateUI(); showCursor();
  if (new URLSearchParams(location.search).has("print")) { preparePrint(); document.body.classList.add("print-preview"); }
  else {
    const split = SplitText.create(".hero-tagline", { type: "words" });
    introAnimation = gsap.timeline({ onUpdate: render, onComplete: () => split.revert() });
    introAnimation.fromTo("#road-reveal", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.5, ease: "power2.out" }, 0);
    introAnimation.fromTo(".hero-logo", { scale: .85, filter: "blur(12px)", opacity: 0 }, { scale: 1, filter: "blur(0px)", opacity: 1, duration: .9 }, 0);
    introAnimation.from(split.words, { opacity: 0, y: 15, stagger: .12, duration: .65 }, .15);
    introAnimation.fromTo(routes[0], { progress: progressAtY(560) }, { progress: progressAtY(690), duration: 1.1, ease: "drive" }, .15);
  }
})();