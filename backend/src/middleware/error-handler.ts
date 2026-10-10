import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/http-error";
import { InvalidRankingError } from "../modules/assessment/scoring";

export const notFoundHandler: RequestHandler = (_req, res) => {
    res.status(404).json({ message: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof HttpError) {
        res.status(error.status).json({ message: error.message });
        return;
    }
    if (error instanceof InvalidRankingError) {
        res.status(400).json({ message: error.message });
        return;
    }
    if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request", issues: error.issues });
        return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
};