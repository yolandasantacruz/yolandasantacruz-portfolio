---
title: Pay with App
slug: pay-with-app
description: Redesigned the transaction flow leading to a 50% drop in dispute rates and a 92% reduction in dispute-related costs
imageUrl: images/projects/pay-with-app/cover.webp
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

## Redesigned the transaction flow leading to a 50% drop in dispute rates and a 92% reduction in dispute-related costs.

<img src="images/projects/pay-with-app/main.webp" srcset="images/projects/pay-with-app/main-400w.webp 400w, images/projects/pay-with-app/main-800w.webp 800w, images/projects/pay-with-app/main-1200w.webp 1200w" sizes="(max-width: 768px) 100vw, 1200px" alt="Pay with App Interface Collage" style="border-radius: 12px; width: 100%;" fetchpriority="high" />

### Brief
Sole designer in a cross-functional pod, working closely with a PM and user researcher to redesign the transaction experience for a key C2C feature. The feature faced high dispute rates that put our Stripe contract at risk and capped rollout at 25% of users. We set out to uncover friction points in the payment experience and deliver fixes that would enable a broader launch.

### Problems

**Contract at Risk:** Dispute rates hit 0.69%, nearing Stripe’s 0.75% threshold. Crossing it could terminate our payment processing agreement, putting a key strategic initiative at risk.

**Rollout Blocked:** The high dispute rate forced us to cap product rollout to just 25% of users, limiting growth and impact.

### Goals

1.  Identify root causes of the high dispute rate throughout the user journey.
2.  Address dispute triggers to enable full rollout beyond the current 25% user cap, expanding reach and revenue.

### User Research

To identify friction points and improve user experience, the researcher and I conducted an iterative design cycle focused on simplifying the interface. We crafted and analyzed the ALPHA and BRAVO flows for new and existing users. Each flow offered a unique user journey, from selecting offers to completing payments, tailored to user familiarity.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <img src="images/projects/pay-with-app/research1.webp" srcset="images/projects/pay-with-app/research1-400w.webp 400w, images/projects/pay-with-app/research1-800w.webp 800w, images/projects/pay-with-app/research1-1200w.webp 1200w" sizes="(max-width: 768px) 100vw, 600px" alt="User Research Flow Alpha" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/pay-with-app/research2.webp" srcset="images/projects/pay-with-app/research2-400w.webp 400w, images/projects/pay-with-app/research2-800w.webp 800w, images/projects/pay-with-app/research2-1200w.webp 1200w" sizes="(max-width: 768px) 100vw, 600px" alt="User Research Flow Bravo" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
</div>

We also reviewed the Add Card and Card Added flows to understand how the timing and context of adding payment information impacted user motivation and retention.

Through this testing, we identified specific pain points where users experienced friction or confusion, particularly in the BRAVO flow for new users. These insights informed our design decisions, guiding us on how and where to minimize friction and optimize the overall user journey.

### Merging of Key Screens

Through testing our previous flow, we discovered that many users misinterpreted the first screen as asking for the amount they had already paid, assuming the next screen was only for card selection rather than in-app payment. This misunderstanding was a major factor contributing to duplicate charges and higher dispute rates.

<img src="images/projects/pay-with-app/merged-screens.webp" alt="Merged Payment Screen" style="border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />

To address this, I designed a consolidated screen that combined both the amount entry and payment selection steps into a single, streamlined experience. I also asked the development team to add a dynamic display of the user’s earnings on each purchase, making rewards immediately visible and reinforcing overall product value.

### Interface Exploration for Payment Flow

To improve the user experience within the payment flow, we explored several design variations, focusing on usability and navigation. Three main designs were tested:

*   **Baseline Design:** A straightforward, minimal interface that emphasizes simplicity. Users input the purchase amount directly and then select a payment method in the next screen.
*   **Stepper with X for Navigation:** This design introduces a stepper at the top, guiding users through each stage of the transaction. The “X” icon provides a quick way to exit, offering users more control and flexibility during the payment flow.
*   **Full-Screen Bottom Sheet with Chevron Navigation:** A full-screen bottom sheet uses chevron navigation to guide users step by step through the payment flow. It keeps the previous screen visible, making the steps feel like a lightweight side action rather than a full context switch.
*   **Full-Screen Takeover with Chevron Navigation:** Similar to the bottom sheet, this variation uses a full-screen takeover, guiding users step by step with chevron navigation.

Historic data showed that over 90% of new users and 20% of existing users claimed offers without being at the location, and based on user research a chevron gave them confidence that their progress would be saved even if they exited the flow. Based on these findings, I chose a **full-screen takeover** to create a more immersive experience.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: center; margin: 2rem 0;">
  <img src="images/projects/pay-with-app/exploration.webp" alt="Interface Design Exploration" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
  <div style="text-align: center; width: 100%;">
    <video autoplay loop muted playsinline preload="none" poster="images/projects/pay-with-app/payment-flow-takeover-poster.jpg" style="width: 100%; aspect-ratio: 9/16;">
      <source src="images/projects/pay-with-app/payment-flow-takeover.webm" type="video/webm">
      <source src="images/projects/pay-with-app/payment-flow-takeover.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <p style="font-size: 0.85rem; color: #717178; margin-top: 0.75rem; font-weight: 600;">Full-screen takeover with a chevron for the win</p>
  </div>
</div>

### Branded Barcode Rendering

To enhance the barcode’s distinctiveness and branding, we applied style changes by integrating brand logos into the card area and using brand colors for the background. We also included key information within the object, such as the offer’s expiration time.

<img src="images/projects/pay-with-app/barcode.webp" alt="Branded Barcode Exploration" style="border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />

### Label Update

For clarity, we renamed the previous "Upside Pay" label to "Pay with app" and changed its color to improve contrast. To highlight the distinct experience, this label appeared throughout the app in other areas like the Home screen and transaction history.

<img src="images/projects/pay-with-app/label-update.webp" alt="Label and Contrast Updates" style="border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />

### Results

*   **50% reduction in dispute rates:** Dispute rates went from 0.69% to 0.33%, and kept the margin since.
*   **92% reduction of dispute costs:** Dispute costs went from an all-time high in May of $8,800 to $700 per month.
*   **251% surge in transaction volume:** With the reduction of disputes, we were able to roll out “Pay with app” from 25% to 100% of our user base, resulting in a 251% surge in transaction volume.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin: 3rem 0;">
  <div style="text-align: center;">
    <img src="images/projects/pay-with-app/dispute-rates.webp" alt="Dispute Rates Chart" style="margin: 0 auto; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
    <p style="font-size: 0.9rem; color: #666; margin-top: 0.75rem; font-weight: 600;">Dispute Rates</p>
  </div>
  <div style="text-align: center;">
    <img src="images/projects/pay-with-app/dispute-costs.webp" alt="Dispute Costs Chart" style="margin: 0 auto; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
    <p style="font-size: 0.9rem; color: #666; margin-top: 0.75rem; font-weight: 600;">Dispute Costs</p>
  </div>
  <div style="text-align: center;">
    <img src="images/projects/pay-with-app/transaction-volume.webp" alt="Transaction Volume Chart" style="margin: 0 auto; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
    <p style="font-size: 0.9rem; color: #666; margin-top: 0.75rem; font-weight: 600;">Transaction Volume</p>
  </div>
</div>

