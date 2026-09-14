import type { Request, Response, NextFunction } from "express";
import {
  News,
  Leader,
  Campaign,
  Event,
  Gallery,
  Video,
  SiteSettings,
  getSiteSettings,
  DonationSettings,
  SocialLink,
} from "../models";

/**
 * Public homepage bundle — everything the homepage needs in one request.
 * Returns only published content plus site-wide settings.
 */
export async function publicBundle(req: Request, res: Response, next: NextFunction) {
  try {
    const [settings, donation, socials, featuredNews, latestNews, featuredLeaders, campaigns, upcomingEvents, featuredVideos, galleries, pastEvents] =
      await Promise.all([
        getSiteSettings(),
        DonationSettings.findOne().lean(),
        SocialLink.find().sort({ order: 1 }).lean(),
        News.find({ isPublished: true, featured: true }).sort({ publishedAt: -1 }).limit(3).lean(),
        News.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(6).lean(),
        Leader.find({ isActive: true, featured: true }).sort({ order: 1 }).limit(4).lean(),
        Campaign.find({ isPublished: true, status: "active" }).sort({ createdAt: -1 }).limit(3).lean(),
        Event.find({ isPublished: true, status: "upcoming", date: { $gte: new Date() } })
          .sort({ date: 1 })
          .limit(4)
          .lean(),
        Video.find({ isPublished: true, featured: true }).sort({ publishedAt: -1 }).limit(3).lean(),
        Gallery.find({ isPublished: true }).sort({ createdAt: -1 }).limit(4).lean(),
        Event.find({ isPublished: true, status: "past" }).sort({ date: -1 }).limit(4).lean(),
      ]);

    res.json({
      settings,
      donation,
      socials,
      featuredNews,
      latestNews,
      featuredLeaders,
      campaigns,
      upcomingEvents,
      featuredVideos,
      galleries,
      pastEvents,
    });
  } catch (err) {
    next(err);
  }
}