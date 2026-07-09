// Idempotent seed script: creates indexes, seeds the admin account, and upserts
// the 3-day bootcamp curriculum into MongoDB.
//
// Run with: npm run seed

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import dns from "dns";
// Windows/Node sometimes hands c-ares a link-local IPv6 DNS server that can't
// resolve the _mongodb._tcp SRV record Atlas needs, even though the OS resolver
// works fine. Point Node's resolver at public DNS to avoid ECONNREFUSED on querySrv.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { bootcampSeedContent } from "../lib/seed-data/bootcamp-content";
import { courses as seedCourses } from "../lib/mock-data";

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "AI_LMS_Prototype";
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  const client = new MongoClient(uri);
  await client.connect();
  console.log(`Connected. Seeding database: ${dbName}`);
  const db = client.db(dbName);

  // ---- Indexes ----
  const users = db.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });

  const bootcampContent = db.collection("bootcampContent");
  await bootcampContent.createIndex({ dayNumber: 1 }, { unique: true });

  const apiKeys = db.collection("apiKeys");
  await apiKeys.createIndex({ userId: 1, provider: 1 }, { unique: true });

  const pollResponses = db.collection("pollResponses");
  await pollResponses.createIndex({ pollId: 1, studentId: 1 }, { unique: true });

  const quizResponses = db.collection("quizResponses");
  await quizResponses.createIndex({ quizId: 1, studentId: 1 }, { unique: true });

  const courses = db.collection("courses");
  await courses.createIndex({ slug: 1 }, { unique: true, sparse: true });

  console.log("Indexes ensured.");

  // ---- Seed admin account ----
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@bootcamp.ai").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const adminName = process.env.SEED_ADMIN_NAME || "Admin";

  const existingAdmin = await users.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await users.insertOne({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
      xp: 0,
      createdAt: new Date(),
    });
    console.log(`Seeded admin account: ${adminEmail}`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  // ---- Seed bootcamp curriculum (upsert by dayNumber, safe to re-run) ----
  for (const day of bootcampSeedContent) {
    await bootcampContent.updateOne(
      { dayNumber: day.dayNumber },
      { $set: day },
      { upsert: true }
    );
    console.log(`Upserted bootcamp content for Day ${day.dayNumber}: ${day.title}`);
  }

  // ---- Seed the course catalog (upsert by slug = the mock course id, safe to re-run) ----
  for (const course of seedCourses) {
    const { id: slug, ...rest } = course;
    await courses.updateOne(
      { slug },
      { $set: { ...rest, slug, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(`Upserted course: ${course.title}`);
  }

  await client.close();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
