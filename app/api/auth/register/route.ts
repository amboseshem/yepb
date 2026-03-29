import { processReferral } from "@/lib/mlm";

const url = new URL(req.url);
const refCode = url.searchParams.get("ref");

if (refCode) {
  await processReferral(Number(newUser.id), refCode);
}