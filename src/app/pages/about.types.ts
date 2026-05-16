export interface HeroData {
  greeting: string;
  mission: string;
  socials: { 
    linkedin?: string; 
    twitter?: string; 
    dribbble?: string; 
  };
}

export interface BeliefData {
  statement: string;
}

export interface PillarData {
  badge: string;
  title: string;
  description: string;
  competencies?: { label: string; value: string; }[];
  metrics?: { num: string; label: string; }[];
}

export interface PillarsData {
  work: PillarData;
  philosophy: PillarData;
}

export interface ActionItem {
  type: string;
  title: string;
  imageUrl: string;
}

export interface ActionData {
  tag: string;
  heading: string;
  items: ActionItem[];
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export interface TimelineItem {
  company: string;
  logo: string;
  period: string;
  role: string;
  location: string;
}

export interface TimelineData {
  heading: string;
  subhead: string;
  items: TimelineItem[];
}

export interface PublishedWork {
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export interface PublicationsData {
  heading: string;
  items: PublishedWork[];
}
