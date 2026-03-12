import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../utlis/getDatabase";
import { ObjectId } from "mongodb";

// CREATE HOTEL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    const { _id, id, ...insertData } = body;

    const result = await db.collection("hotels").insertOne({
      ...insertData,
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

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();
    const hotels = await db.collection("hotels").find().toArray();

    const normalized = hotels.map(h => ({
      ...h,
      _id: h._id.toString(),   // 👈 IMPORTANT CHANGE
    }));

    return NextResponse.json({ success: true, data: normalized }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
// export async function GET() {
//   try {
//     const db = await getDatabase();
//     const hotels = await db.collection("Hotels").find().toArray();

//     const normalized = hotels.map(h => ({
//       ...h,
//       id: h._id.toString(),
//     }));

//     return NextResponse.json({ success: true, data: normalized });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

// UPDATE HOTEL
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    const { _id, ...updateData } = body;
    const queryId = /^[0-9a-fA-F]{24}$/.test(_id) ? new ObjectId(_id) : _id;

    await db.collection("hotels").updateOne(
      { _id: queryId as any },
      {
        $set: {
          ...updateData,
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


// DELETE HOTEL
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
    }

    const db = await getDatabase();
    const queryId = /^[0-9a-fA-F]{24}$/.test(id) ? new ObjectId(id) : id;

    const result = await db.collection("hotels").deleteOne({
      _id: queryId as any,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Hotel deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error("HOTEL DELETE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}