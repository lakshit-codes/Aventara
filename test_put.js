async function testHotelUpdate() {
  try {
    const r = await fetch('http://localhost:3000/api/hotels');
    const json = await r.json();
    const hotels = json.data;
    
    console.log("Total hotels:", hotels.length);
    if(hotels.length > 0) {
      const h = hotels[0];
      console.log(`Trying to PUT ${h.hotelName} with ID: ${h._id}`);
      const putRes = await fetch('http://localhost:3000/api/hotels', { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...h, hotelName: h.hotelName + " (Updated)" })
      });
      console.log(`Status: ${putRes.status}`);
      const putJson = await putRes.text();
      console.log(`Response: ${putJson}`);
    }
  } catch(e) {
    console.error(e);
  }
}
testHotelUpdate();
