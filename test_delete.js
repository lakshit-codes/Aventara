async function searchAndDestroy() {
  try {
    const r = await fetch('http://localhost:3000/api/hotels');
    const json = await r.json();
    const hotels = json.data;
    
    console.log("Total hotels:", hotels.length);
    for (const h of hotels) {
      if (h.hotelName === "Ashu Hotel" || h.hotelName === "Leele palace") {
        console.log(`Trying to DELETE ${h.hotelName} with ID: ${h._id}`);
        const delRes = await fetch('http://localhost:3000/api/hotels?id=' + h._id, { method: 'DELETE' });
        console.log(`Status: ${delRes.status}`);
        const delJson = await delRes.text();
        console.log(`Response: ${delJson}`);
      }
    }
  } catch(e) {
    console.error(e);
  }
}
searchAndDestroy();
