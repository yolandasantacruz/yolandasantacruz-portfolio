---
title: Pay with App
slug: pay-with-app
description: Redesigned the transaction flow leading to a 50% drop in dispute rates and a 92% reduction in dispute-related costs
brief: Sole designer in a cross-functional pod, working closely with a PM and user researcher to redesign the transaction experience for a key C2C feature. The feature faced high dispute rates that put our Stripe contract at risk and capped rollout at 25% of users. We set out to uncover friction points in the payment experience and deliver fixes that would enable a broader launch.
imageUrl: /images/projects/pay-with-app/cover.webp
category: FINTECH, MOBILE
role: Senior Product Designer
timeline: 6 Months
team:
  - Senior Product Designer
  - Product Manager
  - User Researcher
  - 8 Software Engineers
order: 1
---

<img src="/images/projects/pay-with-app/main.webp" srcset="/images/projects/pay-with-app/main-400w.webp 400w, /images/projects/pay-with-app/main-800w.webp 800w, /images/projects/pay-with-app/main-1200w.webp 1200w" sizes="(max-width: 768px) 100vw, 1200px" alt="Pay with App Interface Collage" style="border-radius: 12px; width: 100%; margin-bottom: 2rem;" fetchpriority="high" />

<section class="case-study-section">
<div class="section-header-col">
<h3 class="section-title">Problems</h3>
</div>
<div class="section-intro-col">
<p class="section-intro">Contract risk and blocked launch.</p>
</div>
<div class="section-body-col">
<p>Dispute rates hit 0.69%, nearing Stripe’s 0.75% threshold. Crossing it could terminate our payment processing agreement, putting a key strategic initiative at risk.</p>
<p>Additionally, the high dispute rate forced us to cap product rollout to just 25% of users, limiting growth and impact.</p>
</div>
</section>

<section class="case-study-section">
<div class="section-header-col">
<h3 class="section-title">Goals</h3>
</div>
<div class="section-intro-col">
<p class="section-intro">Key metrics to save stripe partnership.</p>
</div>
<div class="section-body-col">
<p>1. Identify root causes of the high dispute rate throughout the user journey.</p>
<p>2. Address dispute triggers to enable full rollout beyond the current 25% user cap, expanding reach and revenue.</p>
</div>
</section>

<section class="case-study-section">
<div class="section-header-col">
<h3 class="section-title">User Research</h3>
</div>
<div class="section-intro-col">
<p class="section-intro">Analyzing flows for new and existing users.</p>
</div>
<div class="section-body-col">
<p>To identify friction points and improve user experience, the researcher and I conducted an iterative design cycle focused on simplifying the interface. We crafted and analyzed the ALPHA and BRAVO flows for new and existing users. Each flow offered a unique user journey, from selecting offers to completing payments, tailored to user familiarity.</p>
<p>We also reviewed the Add Card and Card Added flows to understand how the timing and context of adding payment information impacted user motivation and retention.</p>
<p>Through this testing, we identified specific pain points where users experienced friction or confusion, particularly in the BRAVO flow for new users. These insights informed our design decisions, guiding us on how and where to minimize friction and optimize the overall user journey.</p>
<div class="media-container grid-2" style="margin-top: 2rem; margin-bottom: 0;">
<img src="/images/projects/pay-with-app/research1.webp" srcset="/images/projects/pay-with-app/research1-400w.webp 400w, /images/projects/pay-with-app/research1-800w.webp 800w, /images/projects/pay-with-app/research1-1200w.webp 1200w" sizes="(max-width: 768px) 100vw, 600px" alt="User Research Flow Alpha" loading="lazy" decoding="async" />
<img src="/images/projects/pay-with-app/research2.webp" srcset="/images/projects/pay-with-app/research2-400w.webp 400w, /images/projects/pay-with-app/research2-800w.webp 800w, /images/projects/pay-with-app/research2-1200w.webp 1200w" sizes="(max-width: 768px) 100vw, 600px" alt="User Research Flow Bravo" loading="lazy" decoding="async" />
</div>
</div>
</section>

<section class="case-study-section">
<div class="section-header-col">
<h3 class="section-title">Merging Screens</h3>
</div>
<div class="section-intro-col">
<p class="section-intro">Consolidating steps to prevent duplicate charges.</p>
</div>
<div class="section-body-col">
<p>Through testing our previous flow, we discovered that many users misinterpreted the first screen as asking for the amount they had already paid, assuming the next screen was only for card selection rather than in-app payment. This misunderstanding was a major factor contributing to duplicate charges and higher dispute rates.</p>
<p>To address this, I designed a consolidated screen that combined both the amount entry and payment selection steps into a single, streamlined experience. I also asked the development team to add a dynamic display of the user’s earnings on each purchase, making rewards immediately visible and reinforcing overall product value.</p>
<div class="media-container" style="margin-top: 2rem; margin-bottom: 0;">
<img src="/images/projects/pay-with-app/merged-screens.webp" alt="Merged Payment Screen" loading="lazy" decoding="async" />
</div>
</div>
</section>

<section class="case-study-section">
<div class="section-header-col">
<h3 class="section-title">Interface Exploration</h3>
</div>
<div class="section-intro-col">
<p class="section-intro">Evaluating layout options for payment flow.</p>
</div>
<div class="section-body-col">
<p>To improve the user experience within the payment flow, we explored several design variations, focusing on usability and navigation. Three main designs were tested:</p>
<ul>
<li><strong>Baseline Design:</strong> A straightforward, minimal interface that emphasizes simplicity. Users input the purchase amount directly and then select a payment method in the next screen.</li>
<li><strong>Stepper with X for Navigation:</strong> This design introduces a stepper at the top, guiding users through each stage of the transaction. The “X” icon provides a quick way to exit, offering users more control and flexibility during the payment flow.</li>
<li><strong>Full-Screen Bottom Sheet with Chevron Navigation:</strong> A full-screen bottom sheet uses chevron navigation to guide users step by step through the payment flow. It keeps the previous screen visible, making the steps feel like a lightweight side action rather than a full context switch.</li>
<li><strong>Full-Screen Takeover with Chevron Navigation:</strong> Similar to the bottom sheet, this variation uses a full-screen takeover, guiding users step by step with chevron navigation.</li>
</ul>
<p>Historic data showed that over 90% of new users and 20% of existing users claimed offers without being at the location, and based on user research a chevron gave them confidence that their progress would be saved even if they exited the flow. Based on these findings, I chose a <strong>full-screen takeover</strong> to create a more immersive experience.</p>
<div class="media-container grid-2" style="margin-top: 2rem; margin-bottom: 0; align-items: center;">
<img src="/images/projects/pay-with-app/exploration.webp" alt="Interface Design Exploration" loading="lazy" decoding="async" />
<div class="text-center" style="width: 100%;">
<video autoplay loop muted playsinline preload="none" poster="/images/projects/pay-with-app/payment-flow-takeover-poster.jpg" style="width: 100%; aspect-ratio: 9/16; border-radius: 12px; object-fit: cover;">
<source src="/images/projects/pay-with-app/payment-flow-takeover.webm" type="video/webm">
<source src="/images/projects/pay-with-app/payment-flow-takeover.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
<p class="media-caption">Full-screen takeover with a chevron for the win</p>
</div>
</div>
</div>
</section>

<section class="case-study-section">
<div class="section-header-col">
<h3 class="section-title">Branded Barcode</h3>
</div>
<div class="section-intro-col">
<p class="section-intro">Integrating identity into the barcode rendering.</p>
</div>
<div class="section-body-col">
<p>To enhance the barcode’s distinctiveness and branding, we applied style changes by integrating brand logos into the card area and using brand colors for the background. We also included key information within the object, such as the offer’s expiration time.</p>
<div class="media-container" style="margin-top: 2rem; margin-bottom: 0;">
<img src="/images/projects/pay-with-app/barcode.webp" alt="Branded Barcode Exploration" loading="lazy" decoding="async" />
</div>
</div>
</section>

<section class="case-study-section">
<div class="section-header-col">
<h3 class="section-title">Label Update</h3>
</div>
<div class="section-intro-col">
<p class="section-intro">Renaming and color styling for clarity.</p>
</div>
<div class="section-body-col">
<p>For clarity, we renamed the previous "Upside Pay" label to "Pay with app" and changed its color to improve contrast. To highlight the distinct experience, this label appeared throughout the app in other areas like the Home screen and transaction history.</p>
<div class="media-container" style="margin-top: 2rem; margin-bottom: 0;">
<img src="/images/projects/pay-with-app/label-update.webp" alt="Label and Contrast Updates" loading="lazy" decoding="async" />
</div>
</div>
</section>

<section class="case-study-section">
<div class="section-header-col">
<h3 class="section-title">Results</h3>
</div>
<div class="section-intro-col">
<p class="section-intro">Proven reduction in disputes and growth.</p>
</div>
</section>

<div class="results-stack">
  <!-- Row 1 -->
  <div class="results-stack-row">
    <div class="results-stack-info">
      <div class="metric-value">50<span class="percent-sign">%</span></div>
      <p class="metric-label">Reduction in dispute rates</p>
      <div class="metric-divider"></div>
      <p class="metric-desc">Dispute rates fell from 0.69% to 0.33%, keeping the rate consistently below the critical Stripe limit.</p>
    </div>
    <div class="results-stack-chart">
      <img src="/images/projects/pay-with-app/dispute-rates.webp" alt="Dispute Rates Chart" loading="lazy" decoding="async" />
    </div>
  </div>

  <!-- Row 2 -->
  <div class="results-stack-row">
    <div class="results-stack-info">
      <div class="metric-value">92<span class="percent-sign">%</span></div>
      <p class="metric-label">Reduction in dispute costs</p>
      <div class="metric-divider"></div>
      <p class="metric-desc">Monthly chargeback expenses fell from an all-time high of $8,800 to just $700.</p>
    </div>
    <div class="results-stack-chart">
      <img src="/images/projects/pay-with-app/dispute-costs.webp" alt="Dispute Costs Chart" loading="lazy" decoding="async" />
    </div>
  </div>

  <!-- Row 3 -->
  <div class="results-stack-row">
    <div class="results-stack-info">
      <div class="metric-value">251<span class="percent-sign">%</span></div>
      <p class="metric-label">Increase in transaction volume</p>
      <div class="metric-divider"></div>
      <p class="metric-desc">Expanding the feature to 100% of the user base unlocked a major surge in overall payment volume.</p>
    </div>
    <div class="results-stack-chart">
      <img src="/images/projects/pay-with-app/transaction-volume.webp" alt="Transaction Volume Chart" loading="lazy" decoding="async" />
    </div>
  </div>
</div>
