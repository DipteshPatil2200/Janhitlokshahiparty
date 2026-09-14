import type { Request, Response, NextFunction } from "express";
import { SiteSettings, getSiteSettings, DonationSettings } from "../models";
import { pickDefined } from "../utils/helpers";

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const s = await getSiteSettings();
    res.json(s);
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const s = await getSiteSettings();
    const body = pickDefined({ ...req.body });
    delete body._id;
    await SiteSettings.findByIdAndUpdate(s._id, body, { new: true, runValidators: true });
    const fresh = await getSiteSettings();
    res.json(fresh);
  } catch (err) {
    next(err);
  }
}

export async function getDonationSettings(req: Request, res: Response, next: NextFunction) {
  try {
    let d = await DonationSettings.findOne().lean();
    if (!d) {
      await DonationSettings.create({});
      d = await DonationSettings.findOne().lean();
    }
    res.json(d);
  } catch (err) {
    next(err);
  }
}

export async function updateDonationSettings(req: Request, res: Response, next: NextFunction) {
  try {
    let d = await DonationSettings.findOne();
    if (!d) d = await DonationSettings.create({});
    const body = pickDefined({ ...req.body });
    delete body._id;
    await DonationSettings.findByIdAndUpdate(d._id, body, { new: true, runValidators: true });
    const fresh = await DonationSettings.findOne().lean();
    res.json(fresh);
  } catch (err) {
    next(err);
  }
}