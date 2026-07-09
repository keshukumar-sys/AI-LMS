import { MongoClient, type Db } from "mongodb";
import { resolveMongoUri } from "@/lib/resolve-mongo-uri";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "AI_LMS_Prototype";

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment (.env.local)");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connect(): Promise<MongoClient> {
  // The very first outbound DNS query right after process start occasionally hits
  // ECONNREFUSED on this Windows setup (the resolver's socket isn't fully ready
  // yet), even though every subsequent lookup succeeds. Retry a couple of times
  // instead of surfacing a transient failure to the first real request.
  // Timeouts are kept short so a genuinely unreachable cluster (e.g. a network
  // blocking outbound 27017) fails fast instead of hanging ~30s per attempt.
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resolvedUri = await resolveMongoUri(uri!);
      return await new MongoClient(resolvedUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      }).connect();
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await delay(300 * attempt);
    }
  }
  throw lastErr;
}

let prodClientPromise: Promise<MongoClient> | undefined;

async function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    // Cache across HMR reloads so we don't exhaust Atlas connections, but always
    // re-check the global (not a locally-closed-over variable) so a cleared-out
    // rejection actually gets retried on the next call instead of replaying forever.
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connect().catch((err) => {
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  }
  if (!prodClientPromise) prodClientPromise = connect();
  return prodClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

export default getClientPromise;
