const mongoose = require('mongoose');

const VisibilityRuleSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ['always', 'segments', 'schedule'],
      default: 'always',
    },
    segments: {
      type: [String],
      default: [],
    },
    startAt: Date,
    endAt: Date,
  },
  { _id: false }
);

const NewsFeedItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    title: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    ctaLabel: {
      type: String,
      default: '',
    },
    ctaUrl: {
      type: String,
      default: '',
    },
    segments: {
      type: [String],
      default: [],
    },
    startAt: Date,
    endAt: Date,
    visible: {
      type: Boolean,
      default: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const CampaignContentSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    ctaLabel: {
      type: String,
      default: '',
    },
    ctaUrl: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const SiteSettingsSchema = new mongoose.Schema(
  {
    contact: {
      email: {
        type: String,
        default: 'info@bdflow.com',
      },
      phone: {
        type: String,
        default: '+90 212 000 00 00',
      },
      address: {
        type: String,
        default: 'İstanbul, Türkiye',
      },
    },
    campaignPopup: {
      enabled: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      message: {
        type: String,
        default: '',
      },
      ctaLabel: {
        type: String,
        default: '',
      },
      ctaUrl: {
        type: String,
        default: '',
      },
      items: {
        type: [CampaignContentSchema],
        default: [],
      },
      visibility: {
        type: VisibilityRuleSchema,
        default: () => ({}),
      },
    },
    newsFeed: {
      enabled: {
        type: Boolean,
        default: false,
      },
      items: {
        type: [NewsFeedItemSchema],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
