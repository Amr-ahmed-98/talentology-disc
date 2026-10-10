import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { assessmentRouter } from "./modules/assessment/assessment.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { participantsRouter } from "./modules/participants/participants.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", authRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/facilitator/participants", participantsRouter);
app.use("/api/manager/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);