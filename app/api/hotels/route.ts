import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../utlis/getDatabase";
import { ObjectId } from "mongodb";

// CREATE HOTEL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    
    console.log("BODY:", body);

    const result = await db.collection("Hotels").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    
    console.log("Inserted hotel:", result.insertedId);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
    });

  } catch (err) {
    console.error("HOTEL POST ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET ALL HOTELS
export async function GET() {
  try {
    const db = await getDatabase();
    const hotels = await db.collection("Hotels").find().toArray();

    const normalized = hotels.map(h => ({
      ...h,
      id: h._id.toString(),
    }));

    return NextResponse.json({ success: true, data: normalized });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// UPDATE HOTEL
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    await db.collection("Hotels").updateOne(
      { _id: new ObjectId(body.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}