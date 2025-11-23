// page.js
"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [firebaseData, setFirebaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const fetchData = async () => {
      try {
        const response = await fetch("/api/firebase"); // Ensure correct API route
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else if (isMounted) {
          setFirebaseData(data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval to fetch data every 60 seconds (60000 ms)
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    // Cleanup function: clear interval and prevent state update if component unmounts
    return () => {
      clearInterval(intervalId);
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Firebase Data</h1>
      <pre>{JSON.stringify(firebaseData, null, 2)}</pre>
    </div>
  );
}
