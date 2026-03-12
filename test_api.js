// Custom API testing script

async function testCRUD() {
  const BASE_URL = "http://localhost:3000/api/packages";
  
  console.log("1. Creating Package...");
  const createRes = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Test Package Delete Me",
      destination: "Debug Land",
      itinerary: [
        {
          id: "temp1",
          dayNumber: 1,
          title: "Arrival",
          dayType: "arrival",
          activities: [],
          hotelStays: [],
          transfers: []
        }
      ],
      price: { currency: "USD", amount: 100 }
    })
  });
  
  const createData = await createRes.json();
  console.log("Create Result:", createData);
  
  if (!createData.success) {
    console.error("Test failed at Create.");
    return;
  }
  
  const insertedId = createData.insertedId;
  console.log("Inserted ID:", insertedId);
  
  // 2. Fetch Packages and find the newly created one
  console.log("2. Fetching Packages...");
  const getRes = await fetch(BASE_URL);
  const getData = await getRes.json();
  
  const createdPkg = getData.data.find(p => p.id === insertedId);
  if (!createdPkg) {
    console.error("Test failed at Fetch: package not found via GET.");
    return;
  }
  
  console.log("Fetched Package contains valid ID mapping:", createdPkg.id === insertedId);
  console.log("Package Title:", createdPkg.title);

  // 3. Update the package
  console.log("3. Updating Package...");
  const updateRes = await fetch(BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...createdPkg,
      title: "Test Package - UPDATED"
    })
  });
  const updateData = await updateRes.json();
  console.log("Update Result:", updateData);
  
  if (!updateData.success) {
    console.error("Test failed at Update.");
    return;
  }

  // 4. Delete the package
  console.log("4. Deleting Package...");
  const delRes = await fetch(`${BASE_URL}?id=${insertedId}`, {
    method: "DELETE"
  });
  const delData = await delRes.json();
  console.log("Delete Result:", delData);

  if (!delData.success) {
    console.error("Test failed at Delete.");
    return;
  }

  // 5. Verify Deletion
  const getRes2 = await fetch(BASE_URL);
  const getData2 = await getRes2.json();
  
  const checkDeleted = getData2.data.find(p => p.id === insertedId);
  if (checkDeleted) {
    console.error("Test failed! Package STILL EXISTS in DB after delete.");
  } else {
    console.log("Test Passed! All operations correctly applied to DB.");
  }
}

testCRUD().catch(console.error);
