export interface TimelineItem {
  company: string;
  logo: string;
  period: string;
  role: string;
  location: string;
}

export interface PublishedWork {
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Product Director at Neobank',
    avatar: 'https://placehold.co/100x100/1a1a1a/5ed6cc?text=SC',
    quote: 'Yolanda is a rare talent who can navigate the complex intersection of finance and user experience with effortless precision.'
  },
  {
    name: 'Marcus Thorne',
    role: 'Founder at SaaSFlow',
    avatar: 'https://placehold.co/100x100/1a1a1a/f5ea8c?text=MT',
    quote: 'Her ability to build scalable design systems transformed our engineering velocity. A true partner in product strategy.'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Lead Designer at Fintech Collective',
    avatar: 'https://placehold.co/100x100/1a1a1a/69ffa7?text=ER',
    quote: 'Yolanda has an incredible eye for detail and a deep understanding of user behavior. Her designs are both beautiful and highly functional.'
  }
];

export const PUBLISHED_WORKS: PublishedWork[] = [
  {
    tag: 'ARTICLE',
    title: 'Standardizing Multi-Tenant SaaS Permissions',
    description: 'An exploration of permission models and user roles in complex B2B applications.',
    imageUrl: 'https://placehold.co/800x600/1a1a1a/5ed6cc?text=SaaS+Permissions',
    url: 'https://medium.com'
  },
  {
    tag: 'CASE STUDY',
    title: 'Fintech UX: Balancing Security and Delight',
    description: 'How to design trust-building experiences in highly regulated environments.',
    imageUrl: 'https://placehold.co/800x600/1a1a1a/f5ea8c?text=Fintech+UX',
    url: 'https://medium.com'
  },
  {
    tag: 'GUIDE',
    title: 'The Design System Governance Framework',
    description: 'Establishing a sustainable workflow between design and engineering.',
    imageUrl: 'https://placehold.co/800x600/1a1a1a/69ffa7?text=Governance',
    url: 'https://medium.com'
  }
];

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    company: 'Fintech Corp',
    logo: 'FC',
    period: '2022 — Present',
    role: 'Lead Product Designer',
    location: 'Remote, USA'
  },
  {
    company: 'SaaS Solutions',
    logo: 'SS',
    period: '2020 — 2022',
    role: 'Senior UI/UX Designer',
    location: 'New York, NY'
  },
  {
    company: 'Creative Studio',
    logo: 'CS',
    period: '2018 — 2020',
    role: 'Product Designer',
    location: 'San Francisco, CA'
  },
  {
    company: 'Startup Lab',
    logo: 'SL',
    period: '2016 — 2018',
    role: 'Junior Designer',
    location: 'London, UK'
  },
  {
    company: 'Freelance',
    logo: 'FL',
    period: '2014 — 2016',
    role: 'UI Designer',
    location: 'International'
  },
  {
    company: 'Design Agency',
    logo: 'DA',
    period: '2012 — 2014',
    role: 'Intern / Junior Designer',
    location: 'Madrid, Spain'
  }
];
