export interface NavLink {
  label: string;
  link: string;
  exact?: boolean;
}

export interface HeaderData {
  logo: string;
  links: NavLink[];
}

export interface FooterSocialLink {
  platform: string;
  url: string;
  label: string;
  shortLabel: string;
}

export interface SocialsData {
  links: FooterSocialLink[];
}

export interface FooterData {
  copyright: string;
}
