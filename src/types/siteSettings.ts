export type VisibilityMode = 'always' | 'segments' | 'schedule';

export interface VisibilityRule {
  mode: VisibilityMode;
  segments: string[];
  startAt?: string | null;
  endAt?: string | null;
}

export interface ContactContent {
  email: string;
  phone: string;
  address: string;
}

export interface CampaignContentItem {
  itemId: string;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface CampaignPopup {
  enabled: boolean;
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  items: CampaignContentItem[];
  visibility: VisibilityRule;
}

export interface NewsFeedItem {
  itemId: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  segments: string[];
  startAt?: string | null;
  endAt?: string | null;
  visible: boolean;
  pinned: boolean;
}

export interface NewsFeedSettings {
  enabled: boolean;
  items: NewsFeedItem[];
}

export interface SiteSettings {
  _id?: string;
  contact: ContactContent;
  campaignPopup: CampaignPopup;
  newsFeed: NewsFeedSettings;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contact: {
    email: 'info@bdflow.com',
    phone: '+90 212 000 00 00',
    address: 'İstanbul, Türkiye',
  },
  campaignPopup: {
    enabled: false,
    title: '',
    message: '',
    ctaLabel: '',
    ctaUrl: '',
    items: [],
    visibility: {
      mode: 'always',
      segments: [],
      startAt: null,
      endAt: null,
    },
  },
  newsFeed: {
    enabled: false,
    items: [],
  },
};
