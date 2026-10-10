import type { Request, Response } from "express";
import { loginSchema } from "./auth.schema";
import * as authService from "./auth.service";

export async function login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);
    res.json(await authService.login(email, password));
}