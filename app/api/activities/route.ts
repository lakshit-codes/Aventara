import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../utlis/getDatabase";
import { ObjectId } from "mongodb";

// CREATE ACTIVITY
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    const result = await db.collection("Activities").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET ALL ACTIVITIES
export async function GET() {
  try {
    const db = await getDatabase();
    const activities = await db.collection("Activities").find().toArray();

    const normalized = activities.map(a => ({
      ...a,
      id: a._id.toString(),
    }));

    return NextResponse.json({ success: true, data: normalized });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// UPDATE ACTIVITY
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    await db.collection("Activities").updateOne(
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