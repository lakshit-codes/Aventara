import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../utlis/getDatabase";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

//  CREATE PACKAGE
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(body)

    if (!body.title || !body.itinerary) {
      return NextResponse.json(
        { message: "Invalid package data", success: false },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection("packages");

    //  Clean itinerary safely
    const cleanedItinerary = body.itinerary.map((day: any) => ({
      ...day,
      hotelStays: day.hotelStays?.map((h: any) => ({
        ...h,
        hotelRef: h.hotelRef ? new ObjectId(h.hotelRef) : null,
      })) || [],
      activities: day.activities?.map((a: any) => ({
        ...a,
        activityRef: a.activityRef
          ? new ObjectId(a.activityRef)
          : null,
      })) || [],
    }));

    const result = await collection.insertOne({
      ...body,
      itinerary: cleanedItinerary,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Package created successfully",
        success: true,
        insertedId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST ERROR:", err);

    return NextResponse.json(
      { message: "Server Error", success: false },
      { status: 500 }
    );
  }
}

//  GET ALL PACKAGES
export async function GET() {
  try {
    const db = await getDatabase();

    const packagesCollection = db.collection("packages");
    const hotelsCollection = db.collection("Hotels");
    const activitiesCollection = db.collection("Activities");

    const packages = await packagesCollection.find({}).toArray();

    // Manual populate
    for (const pkg of packages) {
      for (const day of pkg.itinerary || []) {

        for (const stay of day.hotelStays || []) {
          if (stay.hotelRef) {
            stay.hotelData = await hotelsCollection.findOne({
              _id: stay.hotelRef,
            });
          }
        }

        for (const act of day.activities || []) {
          if (act.activityRef) {
            act.activityData = await activitiesCollection.findOne({
              _id: act.activityRef,
            });
          }
        }
      }
    }

    // 🔥 IMPORTANT NORMALIZATION
    const normalizedPackages = packages.map((pkg) => ({
      ...pkg,
      id: pkg._id.toString(),   // Convert Mongo _id to string id

      itinerary: (pkg.itinerary || []).map((day: any) => ({
        ...day,
        id: day.id || randomUUID(),

        hotelStays: (day.hotelStays || []).map((h: any) => ({
          ...h,
          id: h.id || randomUUID(),
        })),

        activities: (day.activities || []).map((a: any) => ({
          ...a,
          id: a.id || randomUUID(),
        })),

        transfers: (day.transfers || []).map((t: any) => ({
          ...t,
          id: t.id || randomUUID(),
        })),
      })),
    }));

    return NextResponse.json(
      { success: true, data: normalizedPackages },
      { status: 200 }
    );

  } catch (err) {
    console.error("GET ERROR:", err);

    return NextResponse.json(
      { message: "Server Error", success: false },
      { status: 500 }
    );
  }
}


// UPDATE PACKAGE
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "Package id is required", success: false },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection("packages");

    // Clean itinerary (same as POST)
    const cleanedItinerary = (body.itinerary || []).map((day: any) => ({
      ...day,
      hotelStays: day.hotelStays?.map((h: any) => ({
        ...h,
        hotelRef: h.hotelRef ? new ObjectId(h.hotelRef) : null,
      })) || [],
      activities: day.activities?.map((a: any) => ({
        ...a,
        activityRef: a.activityRef
          ? new ObjectId(a.activityRef)
          : null,
      })) || [],
    }));

    await collection.updateOne(
      { _id: new ObjectId(body.id) },
      {
        $set: {
          ...body,
          itinerary: cleanedItinerary,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      { message: "Package updated successfully", success: true },
      { status: 200 }
    );

  } catch (err) {
    console.error("PUT ERROR:", err);

    return NextResponse.json(
      { message: "Server Error", success: false },
      { status: 500 }
    );
  }
}


// export async function GET() {
//   try {
//     const db = await getDatabase();

//     const packagesCollection = db.collection("packages");
//     const hotelsCollection = db.collection("master_hotels");
//     const activitiesCollection = db.collection("master_activities");

//     const packages = await packagesCollection.find({}).toArray();

//     // ✅ Manual populate
//     for (const pkg of packages) {
//       for (const day of pkg.itinerary || []) {

//         // Populate Hotels
//         for (const stay of day.hotelStays || []) {
//           if (stay.hotelRef) {
//             stay.hotelData = await hotelsCollection.findOne({
//               _id: stay.hotelRef,
//             });
//           }
//         }

//         // Populate Activities
//         for (const act of day.activities || []) {
//           if (act.activityRef) {
//             act.activityData = await activitiesCollection.findOne({
//               _id: act.activityRef,
//             });
//           }
//         }
//       }
//     }

//     // return NextResponse.json(
//     //   { success: true, data: packages },
//     //   { status: 200 }
//     // );

//     // Convert ObjectId to string
// const normalizedPackages = packages.map((pkg) => ({
//   ...pkg,
//   _id: pkg._id.toString(),

//   itinerary: (pkg.itinerary || []).map((day: any) => ({
//     ...day,
//     id: day.id || crypto.randomUUID(),

//     hotelStays: (day.hotelStays || []).map((h: any) => ({
//       ...h,
//       id: h.id || crypto.randomUUID(),
//     })),

//     activities: (day.activities || []).map((a: any) => ({
//       ...a,
//       id: a.id || crypto.randomUUID(),
//     })),

//     transfers: (day.transfers || []).map((t: any) => ({
//       ...t,
//       id: t.id || crypto.randomUUID(),
//     })),
//   })),
// }));

// return NextResponse.json(
//   { success: true, data: normalizedPackages },
//   { status: 200 }
// );
//   } catch (err) {
//     console.error("GET ERROR:", err);

//     return NextResponse.json(
//       { message: "Server Error", success: false },
//       { status: 500 }
//     );
//   }
// }