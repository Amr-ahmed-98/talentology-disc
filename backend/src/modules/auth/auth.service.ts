import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { HttpError } from "../../lib/http-error";
import { prisma } from "../../lib/prisma";

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatches = user && (await bcrypt.compare(password, user.passwordHash));
    if (!user || !passwordMatches) {
        throw new HttpError(401, "Invalid email or password");
    }

    const token = jwt.sign({ role: user.role }, env.JWT_SECRET, {
        subject: user.id,
        expiresIn: "8h",
    });

    return {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
}