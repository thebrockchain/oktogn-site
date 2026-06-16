/* OKTOGN access gate - shows an "under construction" wall to the public. A bypass code
   (typed, or passed as ?code=... in the URL) unlocks the real site for that browser.
   Include as the FIRST child of <body> so the wall paints before the page content (no flash):
     <script src="gate.js"></script>
   The code itself is NOT in this file - only its SHA-256 hash. Input is hashed and compared,
   so the code can't be read out of the source. (Self-contained SHA-256 so it works over
   plain HTTP too, where window.crypto.subtle is unavailable.) Still a soft pre-launch wall,
   not real security. To change the code, replace CODE_HASH with the SHA-256 of the new code. */
(function () {
  var CODE_HASH = '54ba10ae5d50013c9d2b4ad8d46d098125f75fc3f2aa516375f3d3ff087f293f';
  var STORE_KEY = 'oktogn_access';

  // compact SHA-256 (ASCII), returns lowercase hex
  function sha256(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var mp = Math.pow, mw = mp(2, 32), i, j, out = '', words = [];
    var bitLen = ascii.length * 8;
    var h = sha256.h = sha256.h || [], k = sha256.k = sha256.k || [];
    var pc = k.length, comp = {};
    for (var c = 2; pc < 64; c++) {
      if (!comp[c]) {
        for (i = 0; i < 313; i += c) comp[i] = c;
        h[pc] = (mp(c, .5) * mw) | 0; k[pc++] = (mp(c, 1 / 3) * mw) | 0;
      }
    }
    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) { j = ascii.charCodeAt(i); if (j >> 8) return ''; words[i >> 2] |= j << ((3 - i) % 4) * 8; }
    words[words.length] = (bitLen / mw) | 0; words[words.length] = bitLen;
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), old = h; h = h.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2], a = h[0], e = h[4];
        var t1 = h[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & h[5]) ^ ((~e) & h[6])) + k[i]
          + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & h[1]) ^ (a & h[2]) ^ (h[1] & h[2]));
        h = [(t1 + t2) | 0].concat(h); h[4] = (h[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) h[i] = (h[i] + old[i]) | 0;
    }
    for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (h[i] >> (j * 8)) & 255; out += ((b < 16) ? 0 : '') + b.toString(16); }
    return out;
  }
  function matches(code) { return sha256(String(code).trim()) === CODE_HASH; }
  function unlocked() { try { return localStorage.getItem(STORE_KEY) === CODE_HASH; } catch (e) { return false; } }
  function grant() { try { localStorage.setItem(STORE_KEY, CODE_HASH); } catch (e) {} }

  // shareable bypass link: oktogn.com/?code=...
  try { var q = new URLSearchParams(location.search).get('code'); if (q && matches(q)) grant(); } catch (e) {}
  if (unlocked()) return;

  var DUCK = '<defs><linearGradient id="ucg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00f0ff"/><stop offset=".55" stop-color="#ff2bd6"/><stop offset="1" stop-color="#b6ff1a"/></linearGradient></defs>'
    + '<g fill="url(#ucg)"><path d="M8 43 C8 33 16 27 26 28 C31 28 34 31 37 34 C41 30 48 28 53 33 C60 39 56 51 46 54 C37 57 17 57 11 50 C9 48 8 46 8 43 Z"/><circle cx="24" cy="22" r="13"/><path d="M51 33 Q61 29 58 39 Q56 43 50 41 Z"/></g>'
    + '<path d="M31 42 Q43 39 48 48 Q40 53 30 49 Z" fill="#070612" opacity=".16"/><path d="M13 19 Q0 19 0 24 Q0 29 13 26 Z" fill="#ffb02e"/><circle cx="21" cy="19" r="2.6" fill="#070612"/><circle cx="22" cy="18" r=".9" fill="#fff"/>';

  var css = '#ucGate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:22px;font-family:Inter,system-ui,sans-serif;'
    + 'background:radial-gradient(1100px 600px at 50% -10%,rgba(255,43,214,.14),transparent),linear-gradient(180deg,#070612,#0d0a24)}'
    + '#ucGate *{box-sizing:border-box}'
    + '#ucGate .b{max-width:440px;width:100%;text-align:center;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.10);border-radius:22px;padding:38px 28px;box-shadow:0 30px 80px rgba(0,0,0,.45)}'
    + '#ucGate svg{width:74px;height:74px;display:block;margin:0 auto 14px;overflow:visible;filter:drop-shadow(0 0 22px rgba(255,43,214,.45))}'
    + '#ucGate .k{font-family:Unbounded,Inter,sans-serif;font-weight:900;letter-spacing:.2em;font-size:13px;color:#00f0ff;margin-bottom:10px}'
    + '#ucGate h2{font-family:Unbounded,Inter,sans-serif;font-weight:900;font-size:clamp(26px,7vw,40px);margin:0 0 10px;color:#f2f0ff;line-height:1.05}'
    + '#ucGate .g{background:linear-gradient(90deg,#00f0ff,#ff2bd6 55%,#b6ff1a);-webkit-background-clip:text;background-clip:text;color:transparent}'
    + '#ucGate p{color:#9a93c7;margin:0 0 22px;font-size:15px;line-height:1.6}'
    + '#ucGate form{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}'
    + '#ucGate input{flex:1 1 200px;background:#0b0a1e;border:1px solid rgba(255,255,255,.10);border-radius:12px;color:#f2f0ff;padding:13px 15px;font-size:15px;font-family:inherit}'
    + '#ucGate input:focus{outline:none;border-color:#ff2bd6}'
    + '#ucGate button{font-family:Unbounded,Inter,sans-serif;font-weight:800;letter-spacing:.04em;border:0;border-radius:12px;padding:13px 22px;font-size:15px;cursor:pointer;color:#0a0618;background:linear-gradient(90deg,#00f0ff,#ff2bd6 55%,#b6ff1a)}'
    + '#ucGate .m{margin-top:12px;font-size:13px;min-height:18px;color:#ff2bd6;font-weight:600}';

  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var gate = document.createElement('div'); gate.id = 'ucGate';
  gate.innerHTML = '<div class="b"><svg viewBox="0 0 64 64" aria-hidden="true">' + DUCK + '</svg>'
    + '<div class="k">OKTOGN</div><h2>Under <span class="g">Construction</span></h2>'
    + '<p>We are putting the finishing touches on the board.<br>Have a code? Drop it in to take a look.</p>'
    + '<form autocomplete="off"><input type="password" placeholder="Access code" aria-label="Access code" /><button type="submit">Enter</button></form>'
    + '<div class="m" role="alert"></div></div>';

  function mount() {
    (document.body || document.documentElement).appendChild(gate);
    document.documentElement.style.overflow = 'hidden';
    var form = gate.querySelector('form'), inp = gate.querySelector('input'), msg = gate.querySelector('.m');
    try { inp.focus(); } catch (e) {}
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (matches(inp.value)) { grant(); gate.remove(); document.documentElement.style.overflow = ''; }
      else { msg.textContent = 'That code is not right. Try again.'; inp.value = ''; inp.focus(); }
    });
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
