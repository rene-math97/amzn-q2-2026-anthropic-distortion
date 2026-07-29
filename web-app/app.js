/* ═══════════════════════════════════════════════
   AMZN Q2 2026 PREVIEW — APP JS

   MODEL PHILOSOPHY
   ----------------
   Amazon's headline EPS has stopped describing Amazon.
   Q1 2026 reported $2.78 against a $1.63 consensus — a
   70% "beat" — but the quarter contained $16.8B of
   pre-tax gains on Anthropic securities booked in
   non-operating income. Q3 2025 contained $9.5B of the
   same, alongside $4.3B of one-off charges running the
   other way.

   So this page does two things instead of one:

     1. Decomposes reported EPS into operating EPS and
        the mark-to-market contribution.
     2. Anchors the actual result to OPERATING INCOME
        against the company's guided range, which is the
        only clean comparison available.

   Both are sliders. The tax rate applied to the
   Anthropic gain is an assumption and is labelled as
   one — Amazon does not disclose the after-tax figure.
════════════════════════════════════════════════ */

'use strict';

// ── THEME TOGGLE ────────────────────────────────
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root   = document.documentElement;
  let theme = root.getAttribute('data-theme') || 'dark';

  function applyTheme(t) {
    theme = t;
    root.setAttribute('data-theme', t);
    if (toggle) {
      toggle.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} mode`);
      toggle.innerHTML = t === 'dark'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  applyTheme(theme);
  toggle && toggle.addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
})();

// ── NAV SCROLL SHADOW ───────────────────────────
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const obs = new IntersectionObserver(
    ([e]) => nav.classList.toggle('nav--scrolled', !e.isIntersecting),
    { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
  );
  const sentinel = document.getElementById('hero');
  if (sentinel) obs.observe(sentinel);
})();

/* ── ANCHOR FACTS (sourced; cited in body) ────── */
const CUR_PRICE   = 231.39;    // Close 2026-07-27 (StockAnalysis)
const DIL_SHARES  = 10883;     // Implied Q1 2026 diluted shares, millions ($30,255M ÷ $2.78) — computed
const GUIDE_LO    = 20.0;      // Q2 2026 operating income guidance floor, $B
const GUIDE_HI    = 24.0;      // Q2 2026 operating income guidance ceiling, $B
const PY_OPINC    = 19.2;      // Q2 2025 operating income, $B
const CONS_OPINC  = 23.6;      // Q2 2026 consensus operating income, $B
const CONS_EPS    = 1.82;      // Q2 2026 consensus EPS
const TTM_OCF     = 148531;    // TTM operating cash flow, $M
const TTM_CAPEX   = 147299;    // TTM purchases of property and equipment, net, $M

// ── FORMAT HELPERS ──────────────────────────────
const fmt = {
  eps:  (v) => `$${v.toFixed(2)}`,
  bn:   (v) => `${v < 0 ? '−' : ''}$${Math.abs(v).toFixed(1)}B`,
  bnM:  (v) => `${v < 0 ? '−' : ''}$${Math.abs(v / 1000).toFixed(1)}B`,
  pct:  (v) => `${v.toFixed(1)}%`,
  x:    (v) => `${v.toFixed(2)}×`,
};

// ── ANIMATED NUMBER ─────────────────────────────
function animateValue(el, from, to, formatter, duration = 300) {
  if (!el) return;
  const start = performance.now();
  function step(ts) {
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = formatter(from + (to - from) * ease);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = formatter(to);
  }
  requestAnimationFrame(step);
}

// ── STATE ───────────────────────────────────────
let state = { gain: 0, taxRate: 23, opinc: 23.6, capex: 190 };
let prevUnderlying = 0;

const SCENARIOS = {
  clean: {
    label: 'A Clean Quarter',
    desc: 'No material Anthropic mark. Operating income lands near the $23.6B consensus, inside the guided $20–24B band. In this case reported EPS actually describes the business, the market can read the headline at face value, and attention moves straight to the capex line and the Q3 guide.',
    gain: 0, taxRate: 23, opinc: 23.6, capex: 190, panelClass: 'scenario-base',
  },
  repeat: {
    label: 'Another Q1-Style Mark',
    desc: 'A repeat of Q1 2026, when $16.8B of pre-tax Anthropic gains ran through non-operating income. Headline EPS explodes past consensus and the beat is almost entirely non-operating. This is the trap: the same print that reads as a blowout on a screen is roughly in line once the mark is stripped out.',
    gain: 16.8, taxRate: 23, opinc: 23.6, capex: 190, panelClass: 'scenario-bull',
  },
  reverse: {
    label: 'The Mark Reverses',
    desc: 'Fair-value accounting works in both directions. A downward revaluation of the Anthropic position would push reported EPS below consensus while the operating business performed exactly as guided. Microsoft has already demonstrated this dynamic with its OpenAI stake, which swung EPS by −$0.41 in one quarter and +$1.02 in the next.',
    gain: -8.0, taxRate: 23, opinc: 23.6, capex: 190, panelClass: 'scenario-bear',
  },
};

function calc() {
  const { gain, taxRate, opinc, capex } = state;
  const afterTaxGain = gain * (1 - taxRate / 100);           // $B
  const epsFromGain  = (afterTaxGain * 1000) / DIL_SHARES;   // $/share
  const underlying   = CONS_EPS;                              // operating EPS held at consensus
  const reported     = underlying + epsFromGain;
  const optVsGuide   = opinc;
  const fcf          = (TTM_OCF / 1000) - capex;             // $B, using user capex
  const capexPctOcf  = (capex * 1000) / TTM_OCF * 100;
  return { afterTaxGain, epsFromGain, underlying, reported, optVsGuide, fcf, capexPctOcf };
}

function render() {
  const d = calc();
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  setTxt('sc-gain-readout',  fmt.bn(state.gain));
  setTxt('sc-tax-readout',   `${state.taxRate}%`);
  setTxt('sc-opinc-readout', fmt.bn(state.opinc));
  setTxt('sc-capex-readout', fmt.bn(state.capex));

  setTxt('f-gain',    fmt.bn(state.gain));
  setTxt('f-tax',     `${state.taxRate}%`);
  setTxt('f-epsgain', fmt.eps(d.epsFromGain));

  animateValue(document.getElementById('sc-reported'), prevUnderlying, d.reported, fmt.eps);
  prevUnderlying = d.reported;

  setTxt('sc-underlying', fmt.eps(d.underlying));

  const surpriseEl = document.getElementById('sc-surprise');
  const surprise = (d.reported / CONS_EPS - 1) * 100;
  if (surpriseEl) {
    surpriseEl.textContent = `${surprise >= 0 ? '+' : ''}${surprise.toFixed(0)}% vs. $${CONS_EPS.toFixed(2)} consensus`;
    surpriseEl.classList.toggle('positive', surprise >= 0);
    surpriseEl.classList.toggle('negative', surprise < 0);
  }

  const verdict = document.getElementById('sc-verdict');
  if (verdict) {
    if (Math.abs(d.epsFromGain) < 0.05) {
      verdict.textContent = 'Headline EPS is clean. Read it at face value.';
      verdict.className = 'formula-note';
    } else if (d.epsFromGain > 0) {
      verdict.textContent = `Of the reported ${fmt.eps(d.reported)}, ${fmt.eps(d.epsFromGain)} is a non-operating mark. The operating business delivered ${fmt.eps(d.underlying)} — in line, not a blowout.`;
      verdict.className = 'formula-note';
    } else {
      verdict.textContent = `The reported ${fmt.eps(d.reported)} understates the business by ${fmt.eps(Math.abs(d.epsFromGain))}. Operating performance was ${fmt.eps(d.underlying)}, exactly as guided.`;
      verdict.className = 'formula-note';
    }
  }

  // Operating income vs guidance band
  const bandPct = (v) => `${Math.max(0, Math.min(100, ((v - 18) / 9) * 100)).toFixed(1)}%`;
  const bandFill = document.getElementById('opinc-fill');
  const bandMark = document.getElementById('opinc-marker');
  if (bandFill) {
    bandFill.style.left  = bandPct(GUIDE_LO);
    bandFill.style.width = `${(((GUIDE_HI - GUIDE_LO) / 9) * 100).toFixed(1)}%`;
  }
  if (bandMark) {
    bandMark.style.left = bandPct(d.optVsGuide);
    const tag = bandMark.querySelector('.price-bar-tag');
    if (tag) tag.innerHTML = `${fmt.bn(d.optVsGuide)}<br/>Outcome`;
  }
  setTxt('sc-opinc-verdict',
    d.optVsGuide > GUIDE_HI ? 'Above the guided ceiling — the pattern in 4 of the last 6 quarters'
    : d.optVsGuide < GUIDE_LO ? 'Below the guided floor — has not happened in 6 quarters'
    : 'Inside the guided band');

  // FCF panel
  setTxt('sc-fcf', fmt.bn(d.fcf));
  const fcfEl = document.getElementById('sc-fcf');
  if (fcfEl) {
    fcfEl.classList.toggle('positive', d.fcf >= 0);
    fcfEl.classList.toggle('negative', d.fcf < 0);
  }
  setTxt('sc-capex-pct', `${d.capexPctOcf.toFixed(0)}% of operating cash flow`);
}

function applyScenario(key) {
  const sc = SCENARIOS[key];
  if (!sc) return;
  state = { gain: sc.gain, taxRate: sc.taxRate, opinc: sc.opinc, capex: sc.capex };

  const panel = document.getElementById('scenario-panel');
  if (panel) panel.className = `scenario-panel ${sc.panelClass}`;
  const n = document.getElementById('sc-name');
  const de = document.getElementById('sc-desc');
  if (n) n.textContent = sc.label;
  if (de) de.textContent = sc.desc;

  const g = document.getElementById('slider-gain');
  const t = document.getElementById('slider-tax');
  const o = document.getElementById('slider-opinc');
  const c = document.getElementById('slider-capex');
  if (g) g.value = String(Math.round(sc.gain * 10));
  if (t) t.value = String(sc.taxRate);
  if (o) o.value = String(Math.round(sc.opinc * 10));
  if (c) c.value = String(sc.capex);

  render();
}

// ── WIRING ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scenario-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyScenario(btn.dataset.scenario);
    });
  });

  function markCustom() {
    const n = document.getElementById('sc-name');
    const de = document.getElementById('sc-desc');
    if (n) n.textContent = 'Your Assumptions';
    if (de) de.textContent = 'You have moved the model off the preset. Operating EPS is held at the $1.82 consensus so the sliders isolate the distortion rather than compounding two guesses. The tax rate applied to the mark is an assumption — Amazon does not disclose the after-tax figure on these gains.';
    const p = document.getElementById('scenario-panel');
    if (p) p.className = 'scenario-panel';
    document.querySelectorAll('.scenario-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
  }

  const g = document.getElementById('slider-gain');
  const t = document.getElementById('slider-tax');
  const o = document.getElementById('slider-opinc');
  const c = document.getElementById('slider-capex');

  if (g) g.addEventListener('input', () => { state.gain    = Number(g.value) / 10; markCustom(); render(); });
  if (t) t.addEventListener('input', () => { state.taxRate = Number(t.value);      markCustom(); render(); });
  if (o) o.addEventListener('input', () => { state.opinc   = Number(o.value) / 10; markCustom(); render(); });
  if (c) c.addEventListener('input', () => { state.capex   = Number(c.value);      markCustom(); render(); });

  applyScenario('clean');

  // ── AWS GROWTH BARS ───────────────────────────
  document.querySelectorAll('.aws-bar').forEach(bar => {
    const v = parseFloat(bar.dataset.value);
    if (Number.isNaN(v)) return;
    bar.style.width = `${Math.min(v / 32, 1) * 100}%`;
  });

  // ── ENTRANCE ANIMATIONS ───────────────────────
  const items = document.querySelectorAll(
    '.kpi-card, .exec-bullet, .risk-card, .timeline-item, .versus-card, .event-item, .fed-card'
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animation = 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.animationDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });
  }

  // ── ACTIVE NAV LINK ───────────────────────────
  const sections = ['hero','setup','distortion','aws','cash','scenarios','comps','watch','risks','sources'];
  const navLinks = document.querySelectorAll('.nav-links a');
  const so = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--color-text)' : '';
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) so.observe(el);
  });
});
