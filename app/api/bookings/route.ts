import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../utlis/getDatabase";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// GET ALL BOOKINGS
export async function GET() {
  try {
    const db = await getDatabase();
    const bookings = await db.collection("bookings").find().toArray();

    const normalized = bookings.map((b) => ({
      ...b,
      id: b._id.toString(),
      _id: undefined, // remove raw ObjectId
    }));

    return NextResponse.json({ success: true, data: normalized }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("BOOKINGS GET ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// CREATE BOOKING (Mainly for mock/manual entry)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    const { id, _id, ...insertData } = body;

    const result = await db.collection("bookings").insertOne({
      ...insertData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, insertedId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("BOOKINGS POST ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// UPDATE BOOKING STATUS
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    const { id, _id, ...updateData } = body;
    const updateId = id || _id;

    if (!updateId || !ObjectId.isValid(updateId)) {
        return NextResponse.json({ success: false, message: "Valid id required" }, { status: 400 });
    }

    await db.collection("bookings").updateOne(
      { _id: new ObjectId(updateId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("BOOKINGS PUT ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// DELETE BOOKING
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Valid id required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Booking deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("BOOKINGS DELETE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
