import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../utlis/getDatabase";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// GET ALL COUPONS
export async function GET() {
  try {
    const db = await getDatabase();
    const coupons = await db.collection("coupons").find().toArray();

    const normalized = coupons.map((c) => ({
      ...c,
      _id: c._id.toString(),
    }));

    return NextResponse.json({ success: true, data: normalized }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("COUPONS GET ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// CREATE COUPON
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    const { _id, ...insertData } = body;

    const result = await db.collection("coupons").insertOne({
      ...insertData,
      usedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, insertedId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("COUPONS POST ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// UPDATE COUPON
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    const { _id, ...updateData } = body;
    const queryId = /^[0-9a-fA-F]{24}$/.test(_id) ? new ObjectId(_id) : _id;

    await db.collection("coupons").updateOne(
      { _id: queryId as never },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("COUPONS PUT ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// DELETE COUPON
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing id" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const queryId = /^[0-9a-fA-F]{24}$/.test(id) ? new ObjectId(id) : id;

    const result = await db.collection("coupons").deleteOne({ _id: queryId as never });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("COUPONS DELETE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
