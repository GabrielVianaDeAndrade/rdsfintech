import { Router } from "express";
import { authRouter } from "./auth.routes";
import { kycRouter } from "./kyc.routes";
import { pixRouter } from "./pix.routes";
import { boletoRouter } from "./boleto.routes";
import { loanRouter } from "./loan.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }));

apiRouter.use("/auth", authRouter);
apiRouter.use("/kyc", kycRouter);
apiRouter.use("/pix", pixRouter);
apiRouter.use("/boleto", boletoRouter);
apiRouter.use("/loan", loanRouter);
