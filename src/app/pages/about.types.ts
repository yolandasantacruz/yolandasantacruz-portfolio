export interface HeroData {
  greeting: string;
  mission: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface SocialsData {
  links: SocialLink[];
}

export interface BeliefData {
  statement: string;
}

export interface AboutMeSection {
  badge: string;
  title: string;
  description: string;
  metrics?: { num: string; label: string; }[];
  linkUrl?: string;
  linkLabel?: string;
  videoUrl?: string;
  image?: string;
}

export type AboutMeData = AboutMeSection[];

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
  profileUrl?: string;
}

export interface TimelineItem {
  company: string;
  logo: string;
  period: string;
  role: string;
}

export interface TimelineData {
  heading: string;
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
