// route.js
import { database } from "../../../lib/firebase";
import { ref, get } from "firebase/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Reference to your Firebase Realtime Database
    const dataRef = ref(database, "/");

    // Fetch the data from the database
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({ error: "No data available" });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
