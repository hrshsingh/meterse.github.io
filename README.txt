MeterSe investor deck
====================

Open index.html directly in a modern browser. No server or network connection is
required. All presentation copy, speaker notes, colors for funding categories,
and example amounts are editable in config.js. Keep the existing item counts;
the five funding percentages must be non-negative and add up to 100.

The included funding amount and allocation are illustrative, not company data.
Replace them before presenting. The bundled 1406.jpg is a recreated visual
fallback because the original attachment was not available as a local file.
Replace it with the original 1406.jpg for the exact supplied logo.

Click, Space, Enter, PageDown, Right or Down: advance.
Backspace, PageUp, Left or Up: restore the previous step.
P: presenter window (allow popups if blocked). F: fullscreen.
Ctrl+P / Cmd+P: print or save a seven-page 16:9 PDF.
Open index.html?print for the print preview. The last click zooms out to the
whole journey; select a chapter or the map to revisit a completed slide.

The vendor folder contains GSAP 3.15.1 and the Inter and Poppins fonts for
offline use. Font licenses are included there. GSAP's standard license:
https://gsap.com/standard-license/

DOWNLOADS AND EDITING
====================
downloads/MeterSe-Complete.zip: self-contained offline browser presentation,
all source code, GSAP libraries, fonts, logo, PDF, and editable-text PowerPoint.
Extract the ZIP before opening index.html. No installation or server is needed.

downloads/MeterSe-Deck.pdf: seven completed slides, 16:9, static and shareable.
downloads/MeterSe-Editable.pptx: seven 16:9 slides with editable text and speaker
notes. The road, vehicles, cards, and other artwork are flattened backgrounds.
Import this PPTX into Google Slides, or open it in PowerPoint.

GSAP animations, the continuous camera, click-by-click reveals, presenter popup,
and interactive Q&A map run in the HTML edition only. They are NOT embedded in
the PDF or PPTX. PowerPoint and Google Slides do not execute JavaScript/GSAP.
There is no claim of native, pixel-identical animated PowerPoint conversion.

For PowerPoint, install the TTF files in vendor/desktop-fonts before opening the
PPTX to prevent font substitution. Google Slides offers Poppins and Inter in
its font picker. Importers may slightly change text wrapping and spacing.
Changing the PPTX does not change config.js or the browser deck, and vice versa.
The illustrative funding figures and bracketed placeholders must be replaced.

REBUILDING AND TESTING (OPTIONAL)
===============================
Node.js 22+ is recommended. Run from this folder:
	npm install
	npx playwright install chromium
	npm run bundle
	npm test
	npm run export

Bundle restores vendor assets from installed packages; Latin-subset desktop fonts
are decompressed locally from the WOFF2 files. Existing 1406.jpg is never replaced.
The logo supplied here was rasterized from the included logo-source.html visual
recreation. Replace 1406.jpg with the original attachment for exact source art.

Export regenerates the seven slide PNGs, PDF, editable-text PPTX, and ZIP under
downloads. Test screenshots are under downloads/test-results, not in the ZIP.
The output package excludes node_modules; dependencies are needed only to rebuild.
Use the browser version for full animations. Frame rate depends on hardware,
browser, display resolution, and power settings; a universal 60 FPS is not assured.