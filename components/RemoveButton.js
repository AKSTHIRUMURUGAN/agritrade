"use client";
import { useRouter } from 'next/navigation';

const RemoveButton = ({ id, type = 'land', onRemoved }) => {
  const router = useRouter();

  const handleRemove = async () => {
    const confirmed = confirm("Are you sure you want to delete this? This cannot be undone.");
    if (!confirmed) return;

    try {
      const endpoint = type === 'land' ? `/api/land?id=${id}` : `/api/farmershare?id=${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });

      if (res.ok) {
        if (onRemoved) onRemoved();
        else router.refresh();
      } else {
        alert("Failed to delete. Please try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleRemove}
      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition font-medium"
    >
      Delete
    </button>
  );
};

export default RemoveButton;
