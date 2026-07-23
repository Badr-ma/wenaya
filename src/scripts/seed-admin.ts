/**
 * Seed script — creates the first admin user in Redis.
 *
 * Usage:
 *   ADMIN_SEED_USERNAME=admin ADMIN_SEED_PASSWORD=secret123 ADMIN_SEED_NAME="Admin User" \
 *     npx tsx src/scripts/seed-admin.ts
 *
 * Or pass as CLI args:
 *   npx tsx src/scripts/seed-admin.ts admin secret123 "Admin User"
 *
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local or env.
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { Redis } from "@upstash/redis";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error("Error: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set.");
    process.exit(1);
  }

  const redis = new Redis({ url, token });

  // Read from env or CLI args
  const args = process.argv.slice(2);
  const username = (args[0] || process.env.ADMIN_SEED_USERNAME || "").toLowerCase().trim();
  const password = args[1] || process.env.ADMIN_SEED_PASSWORD || "";
  const name = args[2] || process.env.ADMIN_SEED_NAME || username;

  if (!username || !password) {
    console.error("Error: username and password are required.");
    console.error('\nUsage: npx tsx src/scripts/seed-admin.ts <username> <password> ["Display Name"]');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("Error: password must be at least 6 characters.");
    process.exit(1);
  }

  const key = `admin:user:${username}`;
  const existing = await redis.get(key);
  if (existing) {
    console.error(`Error: user "${username}" already exists. Delete it first or choose a different username.`);
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = {
    username,
    password: hash,
    name,
    createdAt: new Date().toISOString(),
  };

  await redis.set(key, user);
  console.log(`✓ Admin user "${username}" created successfully.`);
  console.log(`  Name: ${name}`);
  console.log(`  Key:  ${key}`);
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
