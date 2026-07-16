import { isProduction } from "@/config/env";
import type { BaasProvider } from "./baas.types";
import { HttpBaasProvider } from "./httpBaas.provider";
import { MockBaasProvider } from "./mockBaas.provider";

let instance: BaasProvider | null = null;

export function getBaasProvider(): BaasProvider {
  if (!instance) {
    instance = isProduction ? new HttpBaasProvider() : new MockBaasProvider();
  }
  return instance;
}
