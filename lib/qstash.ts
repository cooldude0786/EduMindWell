import { Client } from "@upstash/qstash";

const qstashBaseUrl =
  process.env.QSTASH_URL ??
  (process.env.QSTASH_REGION
    ? `https://qstash.${process.env.QSTASH_REGION}.upstash.io`
    : undefined);

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
  baseUrl: qstashBaseUrl,
});