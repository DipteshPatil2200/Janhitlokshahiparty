import type { Request, Response, NextFunction } from "express";
import {
  News,
  Leader,
  Campaign,
  Event,
  Gallery,
  Video,
  DocumentModel,
  JoinRequest,
  VolunteerRequest,
  ContactMessage,
} from "../models";

export async function dashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const [news, leaders, campaigns, events, gallery, videos, documents, joins, volunteers, contacts] =
      await Promise.all([
        News.countDocuments(),
        Leader.countDocuments(),
        Campaign.countDocuments(),
        Event.countDocuments(),
        Gallery.countDocuments(),
        Video.countDocuments(),
        DocumentModel.countDocuments(),
        JoinRequest.countDocuments(),
        VolunteerRequest.countDocuments(),
        ContactMessage.countDocuments(),
      ]);
    const [pendingJoins, pendingVolunteers, unreadContacts] = await Promise.all([
      JoinRequest.countDocuments({ status: "new" }),
      VolunteerRequest.countDocuments({ status: "new" }),
      ContactMessage.countDocuments({ status: "new" }),
    ]);
    res.json({
      counts: { news, leaders, campaigns, events, gallery, videos, documents, joins, volunteers, contacts },
      pending: { pendingJoins, pendingVolunteers, unreadContacts },
    });
  } catch (err) {
    next(err);
  }
}