# The Anthropic Distortion — Amazon (AMZN) Q2 2026 Earnings Preview

An interactive earnings preview published **July 28, 2026**, ahead of Amazon's Q2 report on **Thursday, July 30, after market close** (call 5:00pm ET).

**Live site:** https://rene-math97.github.io/amzn-q2-2026-anthropic-distortion/

**No rating. No price target.**

---

## The finding

Amazon's Q1 2026 printed **$2.78 of diluted EPS against a $1.63 consensus** — a 70% beat. That quarter also contained **$16.8B of pre-tax gains on Anthropic securities**, booked in non-operating income: $4.5B of reclassification gains on converted notes plus $12.3B of upward fair-value adjustments.

```
Applying a 21–25% tax rate to $16.8B
  → roughly $1.16 to $1.22 per share of the reported $2.78
  → underlying EPS near $1.56–$1.62 vs. the $1.63 estimate
```

**The 70% beat was, operationally, a roughly in-line quarter.**

This is not a one-off. Q3 2025 contained **$9.5B of Anthropic gains** *and* **$4.3B of one-off charges** running the other way — two distortions, opposite directions, one headline number.

## What to read instead

**Operating income against the guided band.** Q2 2026 is guided to **$20.0–24.0B** against $19.2B a year earlier. That measure has a track record worth extrapolating:

- Above the guided **ceiling in 4 of the last 6 quarters**
- Inside the band in the other 2
- **Never below the floor**
- Revenue has exceeded the guided ceiling **five consecutive quarters**

## The number that actually decides the stock

```
TTM operating cash flow  $148,531M  (+30%)
TTM capex, net           $147,299M  (+67%)
TTM free cash flow       $  1,232M  (was $25,925M)

Capex as % of operating cash flow = 99.2%
```

Long-term debt went from **$65,648M to $119,074M in a single quarter**, followed by C$14.0B of notes in June and a multi-tranche dollar issue in July.

Against that: AWS backlog of **$364B** with a 5.5-year weighted life, which **excludes** the >$100B Anthropic commitment. The OpenAI arrangement is **$38.0B expanded by $100.0B over eight years** — note the widely circulated "$50B OpenAI-AWS deal" figure does not match the filing.

## AWS is reaccelerating, six quarters running

| Q4 24 | Q1 25 | Q2 25 | Q3 25 | Q4 25 | Q1 26 |
|---|---|---|---|---|---|
| +19% | +17% | +17% | +20% | +24% | **+28%** |

Fastest in fifteen quarters, roughly a $150B annualised run rate, with a $2B sequential increase — the largest Q4-to-Q1 in AWS history.

## The model

A **decomposition**, not a valuation. Operating EPS is held at the $1.82 consensus so the sliders isolate the distortion rather than compounding two guesses.

```
EPS from mark = pre-tax mark × (1 − tax rate) ÷ 10,883M shares
Reported EPS  = operating EPS + EPS from mark
```

The tax rate is **an assumption, not a disclosure** — Amazon doesn't break out the after-tax effect. The share count is derived from Q1's $30,255M ÷ $2.78.

## Sourcing standard

SEC filings and Amazon IR documents first, market data second, analyst notes last and attributed. My arithmetic is tagged **computed**.

### Three things deliberately excluded

1. **A body of July news-flow narrative was removed entirely.** During research, material about regulatory actions, headcount, executive moves and tariff commentary could not be traced back to retrievable sources. Rather than publish it with plausible-looking citations, it was cut. What remains comes from documents read directly: the Q1 release, the 10-Q, the 8-K debt filings, and the call transcript.
2. **The "about $200 billion" FY2026 capex guidance figure is not used.** It could not be verified against any Amazon filing, and it's load-bearing enough that using it unverified would be irresponsible. The capex slider defaults to $190B as an explicitly illustrative level, with the verified $147.3B trailing figure marked on the scale.
3. **No options-implied move is quoted**, because none could be sourced.

### Data traps named on the page

- One widely syndicated tracker publishes Q2 revenue consensus of **$188.7B — below Amazon's own $194.0B guidance floor**. Unusable.
- A **"BofA raises Amazon $145 → $165"** headline circulated in July. The article body describes retail sell-through for an unrelated consumer product, and the levels are incompatible with AMZN at $231 and BofA's own $310 target. **It is not an Amazon note.**
- The street-low target is published as **$175 / $207 / $218 / $230** by four trackers. The $175 traces to a February DA Davidson note that **the firm itself superseded with $250 in April**. No single "street low" is asserted.

---

## Stack

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no external data calls. Dark and light themes.

```
├── index.html          # redirect to web-app/
├── web-app/
│   ├── index.html      # the preview
│   ├── style.css       # design system + guidance band
│   └── app.js          # EPS decomposition model, sliders, AWS bars
└── README.md
```

## Disclaimer

Independent research written for a public portfolio. **Not investment advice**, not a recommendation to buy or sell any security, and it carries no rating or price target. Do your own work.
