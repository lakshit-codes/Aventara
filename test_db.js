async function checkDeletes() {
  const { MongoClient } = require('mongodb');
  require('dotenv').config();
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const hotels = await db.collection('hotels').find().toArray();
    console.log("Hotels in DB:", hotels.map(h => ({ _id: h._id, type: typeof h._id, isObjectId: typeof h._id === 'object' })));
    
    // Testing delete query
    if(hotels.length > 0) {
      const h = hotels[0];
      const idString = h._id.toString();
      const queryIds = [idString];
      if (/^[0-9a-fA-F]{24}$/.test(idString)) {
        const { ObjectId } = require('mongodb');
        queryIds.push(new ObjectId(idString));
      }
      
      const count = await db.collection('hotels').countDocuments({ _id: { $in: queryIds } });
      console.log(`Document matches for ID ${idString}: ${count}`);
    }
  } finally {
    await client.close();
  }
}
checkDeletes();
