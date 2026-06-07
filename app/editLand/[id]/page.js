import EditLand from "../../../components/EditLand";

const getLandById = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/land/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch land");
    return res.json();
  } catch (error) {
    console.error("Error in getLandById:", error);
    return null;
  }
};

export default async function EditLandPage({ params }) {
  const { id } = params;
  const data = await getLandById(id);

  if (!data || !data.land) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Land not found.</p>
        </div>
      </div>
    );
  }

  return <EditLand id={id} Land={data.land} />;
}
