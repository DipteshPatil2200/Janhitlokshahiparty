import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User, toPublicUser } from "../models/User";
import { signToken } from "../utils/helpers";
import { AppError } from "../middleware/error";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(400, "Email and password are required");
    }
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }
    if (!user.isActive) {
      throw new AppError(403, "Account is disabled");
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, "Invalid credentials");
    }
    user.lastLoginAt = new Date();
    await user.save();
    const token = signToken({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "Unauthorized");
    const user = await User.findById(req.user.id).lean();
    if (!user) throw new AppError(404, "User not found");
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

const ROLES = ["super_admin", "content_manager", "media_manager", "organization_manager"] as const;

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) throw new AppError(400, "name, email, password required");
    if (String(password).length < 8) {
      throw new AppError(400, "Password must be at least 8 characters");
    }
    if (role && !ROLES.includes(role)) throw new AppError(400, "Invalid role");
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) throw new AppError(409, "A user with this email already exists");
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role || "content_manager",
    });
    res.status(201).json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.min(10000, Math.max(1, Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(),
    ]);
    res.json({ items: users.map(toPublicUser), total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError(404, "User not found");
    const { name, role, isActive, password } = req.body;
    if (name !== undefined) user.name = name;
    if (role !== undefined) {
      if (!ROLES.includes(role)) throw new AppError(400, "Invalid role");
      user.role = role;
    }
    if (isActive !== undefined) user.isActive = !!isActive;
    if (password) {
      if (String(password).length < 8) throw new AppError(400, "Password must be at least 8 characters");
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.id === req.params.id) {
      throw new AppError(400, "You cannot delete your own account");
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new AppError(404, "User not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}