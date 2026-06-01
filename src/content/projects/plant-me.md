---
title: PlantMe
slug: plant-me
description: Designed a 0 to 1 experience for a C2C app
imageUrl: images/projects/plant-me/cover.webp
category: PROPTECH
role: Senior UX/UI Designer
timeline: Mar 2022 - Dec 2022
techStack: ["Angular", "SCSS", "Firebase"]
order: 4
---

## Designed a 0 to 1 experience for a C2C app

<img src="images/projects/plant-me/main.webp" alt="PlantMe Hero Mockup" style="border-radius: 12px; width: 100%;" fetchpriority="high" />

### Brief
Designing the end-to-end experience for a C2C platform connecting gardening specialists with clients for services like landscaping, with PlantMe earning commission on bookings.

### Goals
1. Create a native app for both Android and iOS that allows contractors to showcase their services.
2. Enable search for services using filters such as landscaping type, dates, location, and price, and search for specific types of landscaping, such as maintenance, mowing, and pest control.
3. Design a review-based system where clients and contractors can rate the experience.

### Market Research
Beginning with market research, I spent some time familiarizing myself with the landscaping industry. I wanted to learn more about the market for PlantMe.

**Key findings:**
* The landscaping industry generates $93 billion in annual revenues.
* Employs more than 1 million people annually.
* Has an annual growth rate of 3.5%.
* Consists of nearly 500,000 businesses.

### Competitive Analysis
To get a better understanding of the competitors, I performed a competitive analysis by downloading 3 landscaping apps that offered similar functionalities to identify their strengths and weaknesses. This allowed me to learn how other apps approached connecting customers with contractors, and what opportunities were available for PlantMe to distinguish itself.

<img src="images/projects/plant-me/competitive-analysis.webp" alt="Competitive Analysis Matrix" style="border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />

### User Interviews & Persona Creation
To better understand the members of the community, I conducted my research by creating an interview guide to use during 1-on-1 interviews, focusing on user needs. I conducted 3 interviews with participants of different backgrounds ranging in age from 28-36. Two of the participants had experience as contractors in the landscaping industry and one of them was a potential customer for the end product.

Based on their feedback, I created personas to represent our users' needs, experiences, behaviors, and goals. It also helped me to identify the users I was designing for and their expectations. Understanding the clients and their needs was the number one priority, and based on that, I set the MVP scope of the project.

The app targeted users looking to offer professional services, as well as individuals looking to fulfill tasks that they couldn't perform.

<img src="images/projects/plant-me/persona.webp" alt="User Persona 1" style="border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <img src="images/projects/plant-me/persona-1.webp" alt="User Persona 2" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/persona-2.webp" alt="User Persona 3" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
</div>

#### MVP Core Features
After addressing user needs, these were the features we decided to focus on for our MVP:
* **Infinite scroll gallery** showcasing recently posted projects.
* **Direct Messaging screen** where users can connect with contractors/clients.
* **Review-based system** visible on contractors' and clients' profiles.

### Sitemap
I wanted to keep the sections of the app organized neatly and easy to navigate for the user. Noticing how other landscaping design apps were structured, I created the primary navigation with three sections:
* **Home:** Where users could see the latest projects posted around the area, contractors, and a basic search form.
* **Search:** A dedicated search screen with tailored filters.
* **Ideabook:** Where users could save projects they liked or services they were interested in.

I also created a secondary navigation with user details and a contact feature.

<img src="images/projects/plant-me/sitemap.webp" alt="PlantMe Sitemap Architecture" style="border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />

### Wireframe Sketches & Task Flows
I created two flows:
* **Flow 1 (Gallery-oriented):** A user going through the infinite scroll image gallery, clicking on a project to learn details, going to the user's profile screen, and contacting the contractor or client.
* **Flow 2 (Search-oriented):** A search-oriented journey with filters that allowed clients to locate contractors in the selected categories, then display the results, go through the contractor's profile, and learn more about previous projects. From there, the user could decide if they wanted to connect with the other party to start a dialogue.

In order to focus on what I wanted the users to accomplish in my MVP, I created two main task flows:
* User view the latest projects posted around the area.
* User finds contractor through the search by filters functionality.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <div style="text-align: center;">
    <img src="images/projects/plant-me/lofi-sketches.webp" alt="Lo-fi Wireframe Sketches" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
    <p style="font-size: 0.85rem; color: #717178; margin-top: 0.75rem; font-weight: 600;">Paper wireframe sketches</p>
  </div>
  <div style="text-align: center;">
    <img src="images/projects/plant-me/task-flow.webp" alt="UX Task Flows" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
    <p style="font-size: 0.85rem; color: #717178; margin-top: 0.75rem; font-weight: 600;">User journey task flows</p>
  </div>
</div>

### Mid-Fidelity Prototype
After logging in, users navigated to the homepage where they could view recent projects or search for specific ones by using the filtering tool. While gathering feedback from the prototypes, we realized that it would be more convenient for the user to directly access the message feature and the account details from the primary navigation bar.

<img src="images/projects/plant-me/mid-fi-prototype.webp" alt="Mid Fidelity Prototype" style="border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />

### Style Tile Development
Once I had the product direction defined, a cardinal step was coming up with a design system that allowed scalability. This was necessary to make sure the product ran straight on the line and had a good foundation. That way, when the time to add new features, screens, or modals came to be, there wouldn't be any major alterations or questions about how to proceed.

<img src="images/projects/plant-me/style-tile.webp" alt="Design System Style Tile" style="border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />

### High-Fidelity Prototype & Usability Testing
I created a high-fidelity prototype for users to interact with the MVP during usability testing. I presented my high-fidelity prototype to four testers using Figma Mirror and asked them to perform the actions I was focusing on for the MVP. Everyone was able to navigate them successfully.

Most of the feedback was focused on UI elements, such as the navigation bar color, text weight and size, and selection of icons.

The page that needed the most revision was the **Contractor Details** screen, where the users preferred seeing the overall ranking of the contractor. The "About me" was resolved by displaying the information on the same page. I also changed the call to action to a direct "Message" button and a "Request a quote", as they preferred to directly connect through the app if possible.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <div style="text-align: center;">
    <img src="images/projects/plant-me/high-fi-prototype.webp" alt="High-fidelity Prototype" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
    <p style="font-size: 0.85rem; color: #717178; margin-top: 0.75rem; font-weight: 600;">High-fidelity mockup screens</p>
  </div>
  <div style="text-align: center;">
    <img src="images/projects/plant-me/usability-testing.webp" alt="Usability Testing Iterations" style="margin: 0; border-radius: 12px; width: 100%;" loading="lazy" decoding="async" />
    <p style="font-size: 0.85rem; color: #717178; margin-top: 0.75rem; font-weight: 600;">Usability testing revisions</p>
  </div>
</div>

### Interactive Figma Prototype
Try out the live interactive prototype from the Figma canvas below:

<div style="display: flex; justify-content: center; margin: 2rem 0; width: 100%;">
  <iframe style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 12px; width: 100%; max-width: 800px; aspect-ratio: 16/9;" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2Fz3R91a9uZS2dMRiMj4g2cR%2FPlantme%3Fnode-id%3D124%253A1123%26scaling%3Dcontain" allowfullscreen></iframe>
</div>

### Developed Screens
As the project moved forward I worked on the onboarding screens and the checkout flow. A grid of some of these developed screens is shown below:

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin: 2rem 0;">
  <img src="images/projects/plant-me/screen-1.webp" alt="Onboarding Screen 1" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-2.webp" alt="Onboarding Screen 2" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-3.webp" alt="Onboarding Screen 3" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-4.webp" alt="Onboarding Screen 4" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-5.webp" alt="Service Screen 5" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-6.webp" alt="Service Details Screen 6" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-7.webp" alt="Booking Screen 7" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-8.webp" alt="Checkout Screen 8" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-9.webp" alt="Payment Confirmation Screen 9" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
  <img src="images/projects/plant-me/screen-10.webp" alt="Settings Screen 10" style="margin: 0; border-radius: 8px; width: 100%;" loading="lazy" decoding="async" />
</div>

### Takeaways
Designing a C2C service platform from 0 to 1 taught me the value of structured visual guidelines and modular components early. It allowed our engineering pod to move straight from mid-fidelity iterations to final code-ready layers without confusion.

---

### More to come
Check out my other projects below.
