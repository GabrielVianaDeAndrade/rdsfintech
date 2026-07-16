import { createApp } from "@/app";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

const app = createApp();

app.listen(env.port, () => {
  logger.info(`RDS Fintech BFF rodando na porta ${env.port} (${env.nodeEnv})`);
});
