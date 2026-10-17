import type { Request, Response, NextFunction } from "express";
import { OrganizationUnit } from "../models";

export async function orgTree(req: Request, res: Response, next: NextFunction) {
  try {
    const units = await OrganizationUnit.find().sort({ order: 1 }).lean();
    res.json({ units, tree: buildTree(units) });
  } catch (err) {
    next(err);
  }
}

function buildTree(units: any[]) {
  const map = new Map<string, any>();
  units.forEach((u) => {
    map.set(String(u._id), { ...u, children: [] });
  });
  const roots: any[] = [];
  units.forEach((u) => {
    const node = map.get(String(u._id));
    if (u.parentId && map.has(String(u.parentId))) {
      map.get(String(u.parentId)).children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}