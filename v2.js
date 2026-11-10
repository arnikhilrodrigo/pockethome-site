/* ===========================================================================
   Pocket Home — v2 behaviour layer
   Loaded after the page's own script. Everything here is additive: delete the
   file and the page keeps working exactly as before.

   Right now it does one job — the project brochures ("the surprise"):
     · a badge on every project card that has one
     · a download block inside that project's lightbox

   To add another, drop the PDF in brochures/ and add one line to BROCHURES.
   The key is the project name exactly as it appears on the card.
   =========================================================================== */
(function () {
  "use strict";

  var BROCHURES = {
    "Curve":        { file: "brochures/curve.pdf",     pages: 9, mb: 1.3 },
    "Panorama Box": { file: "brochures/panorama.pdf",  pages: 9, mb: 3.4 },
    "Inside-Out":   { file: "brochures/insideout.pdf", pages: 9, mb: 2.8 },
    "Vaanam":       { file: "brochures/vaanam.pdf",    pages: 9, mb: 2.1 },
    "Illam":        { file: "brochures/illam.pdf",     pages: 9, mb: 2.4 },
    "Nest":         { file: "brochures/nest.pdf",      pages: 9, mb: 2.4 },
    "Arjavam":      { file: "brochures/arjavam.pdf",   pages: 9, mb: 3.7 },
    "Frame":        { file: "brochures/frame.pdf",     pages: 9, mb: 4.7 }
  };

  var GIFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8"/>' +
    '<path d="M2 7h20v5H2z"/><path d="M12 21V7"/>' +
    '<path d="M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z"/>' +
    '<path d="M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></svg>';

  var DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/></svg>';

  function slug(name) {
    return (name || "").trim();
  }

  /* ---------- 1. badge the cards that carry a surprise ---------- */
  function badgeCards() {
    var cards = document.querySelectorAll("#work .grid > button");
    Array.prototype.forEach.call(cards, function (card) {
      var h3 = card.querySelector("h3");
      if (!h3 || !BROCHURES[slug(h3.textContent)]) return;
      var frame = card.querySelector("div");
      if (!frame || frame.querySelector(".ph-gift")) return;
      var tag = document.createElement("span");
      tag.className = "ph-gift";
      tag.innerHTML = GIFT + "<span>Surprise inside</span>";
      frame.appendChild(tag);
    });
  }

  /* ---------- 2. the download block inside the lightbox ---------- */
  function enhanceLightbox(root) {
    var nameEl = root.querySelector(".ph-lb-name");
    var text = root.querySelector(".ph-lb-text");
    if (!nameEl || !text) return;

    var b = BROCHURES[slug(nameEl.textContent)];
    if (!b || text.querySelector(".ph-gift-card")) return;

    var wrap = document.createElement("div");
    wrap.className = "ph-gift-card";
    wrap.innerHTML =
      '<span class="ph-gift-hand">a little something from us</span>' +
      '<div class="ph-gift-row">' +
        '<span class="ph-gift-ico">' + GIFT + "</span>" +
        '<div class="ph-gift-copy">' +
          "<strong>The full project story</strong>" +
          "<span>Plans floor by floor, how the eight essentials were solved here, " +
          "and the numbers behind it — " + b.pages + " pages, free.</span>" +
        "</div>" +
      "</div>" +
      '<a class="ph-gift-btn" href="' + b.file + '" download target="_blank" rel="noopener">' +
        DOWN + "Download the PDF <em>" + b.mb.toFixed(1) + " MB</em></a>";

    /* the whole lightbox is inside a link-free region, but guard anyway so a
       click on the button never bubbles into the close-on-backdrop handler */
    wrap.addEventListener("click", function (e) { e.stopPropagation(); });

    text.appendChild(wrap);
  }

  /* the lightbox is built on demand by the page's own script, so watch for it */
  function watch() {
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes, function (n) {
          if (n.nodeType === 1 && n.classList && n.classList.contains("ph-lb")) {
            enhanceLightbox(n);
            /* re-run when the viewer pages between images, which re-renders */
            new MutationObserver(function () { enhanceLightbox(n); })
              .observe(n, { childList: true });
          }
        });
      });
    });
    mo.observe(document.body, { childList: true });
  }

  function init() {
    badgeCards();
    watch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
