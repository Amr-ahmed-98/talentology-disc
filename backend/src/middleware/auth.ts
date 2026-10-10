import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { Role } from "../generated/prisma/enums";
import { HttpError } from "../lib/http-error";


export function requireRole(...roles: Role[]): RequestHandler {
    return (req, _res, next) => {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            throw new HttpError(401, "Authentication required");
        }

        let role: unknown;
        try {
            role = (jwt.verify(header.slice(7), env.JWT_SECRET) as jwt.JwtPayload).role;
        } catch {
            throw new HttpError(401, "Invalid or expired token");
        }

        if (!roles.includes(role as Role)) {
            throw new HttpError(403, "Forbidden");
        }
        next();
    };
}