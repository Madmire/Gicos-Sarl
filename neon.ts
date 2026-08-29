import { defineConfig } from "@neon/config/v1";

/**
 * GICOS utilise Lakebase Postgres (Neon) uniquement.
 * Auth / Data API / Object Storage / Functions : non utilisés pour l'instant
 * (images via Cloudinary, API FastAPI sur Render).
 */
export default defineConfig({
  auth: false,
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    if (!branch.exists) {
      return { ttl: "7d" };
    }
    return {};
  },
});
