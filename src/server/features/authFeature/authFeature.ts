import { Router } from "express";
import { authRouter } from "./authRouter";

export function initAuthFeature(router: Router): void {
    router.use("/auth", authRouter);
}
