const { MongoClient } = require("mongodb");
const fs = require("fs");

const env = fs.readFileSync(".env", "utf8");
const uriMatch = env.match(/MONGODB_URI="([^"]+)"/);
const dbMatch = env.match(/MONGODB_DB="([^"]+)"/);

const uri = uriMatch ? uriMatch[1] : null;
const dbName = dbMatch ? dbMatch[1] : null;

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    try {
      await db.collection("Activities").rename("activity");
      console.log("Renamed 'Activities' to 'activity'");
    } catch (e) {
      console.log("Skip renaming 'Activities':", e.message);
    }

    try {
      await db.collection("Hotels").rename("hotels");
      console.log("Renamed 'Hotels' to 'hotels'");
    } catch (e) {
      console.log("Skip renaming 'Hotels':", e.message);
    }

    const toDrop = ["rooms", "amenity_categories", "amenities"];
    for (const c of toDrop) {
      try {
        await db.collection(c).drop();
        console.log(`Dropped collection: ${c}`);
      } catch (e) {
        console.log(`Skip dropping '${c}':`, e.message);
      }
    }

    console.log("Migration finished.");
  } finally {
    await client.close();
  }
}
run();
