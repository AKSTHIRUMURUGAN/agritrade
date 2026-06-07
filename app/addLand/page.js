"use client";
import { UploadButton } from "../../src/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddLand() {
  const [landImage, setLandImage] = useState("");
  const [landName, setLandName] = useState("");
  const [landPlace, setLandPlace] = useState("");
  const [landDescription, setLandDescription] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [perStockPrice, setPerStockPrice] = useState("");
  const [minimumStockPrice, setMinimumStockPrice] = useState("");
  const [seed, setSeed] = useState("");
  const [duration, setDuration] = useState("");
  const [profitLossMargin, setProfitLossMargin] = useState("");
  const [soilTest, setSoilTest] = useState(false);
  const [documentVerified, setDocumentVerified] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const [ranking, setRanking] = useState("");
  const [profitLossPercentage, setProfitLossPercentage] = useState("");
  const [yearsStayInMarket, setYearsStayInMarket] = useState("");
  const [status, setStatus] = useState("open");
  const [assured, setAssured] = useState(false);
  const [currentAmount, setCurrentAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/land", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          landImage, landName, landPlace, landDescription,
          totalStock: Number(totalStock), minimumStock: Number(minimumStock),
          perStockPrice: Number(perStockPrice), minimumStockPrice: Number(minimumStockPrice),
          seed, duration: Number(duration), profitLossMargin: Number(profitLossMargin),
          soilTest, documentVerified, kycVerified,
          ranking: Number(ranking), profitLossPercentage: Number(profitLossPercentage),
          yearsStayInMarket: Number(yearsStayInMarket),
          assured, status, currentAmount: Number(currentAmount),
        }),
      });

      if (res.status === 201) {
        router.push("/admin/lands");
      } else {
        throw new Error("Failed to create land entry");
      }
    } catch (error) {
      console.error("Error creating land entry:", error);
      alert("Failed to create land. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Land</h1>
            <p className="text-gray-500 mt-1">Create a new land investment listing</p>
          </div>
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">← Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Land Image</h2>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => setLandImage(res[0].url)}
              onUploadError={(error) => alert(`Upload error: ${error.message}`)}
            />
            {landImage && (
              <div className="mt-4">
                <Image src={landImage} alt="Land" width={400} height={250} className="rounded-lg object-cover" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Land Name *</label>
                <input type="text" value={landName} onChange={(e) => setLandName(e.target.value)} required className={inputClass} placeholder="e.g. Green Valley Farm" />
              </div>
              <div>
                <label className={labelClass}>Location *</label>
                <input type="text" value={landPlace} onChange={(e) => setLandPlace(e.target.value)} required className={inputClass} placeholder="e.g. Punjab, India" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={landDescription} onChange={(e) => setLandDescription(e.target.value)} rows={3} className={inputClass} placeholder="Describe the land, its history, soil quality..." />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Seed Type</label>
                <input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} className={inputClass} placeholder="e.g. Wheat, Rice, Cotton" />
              </div>
            </div>
          </div>

          {/* Stock & Pricing */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock & Pricing</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Total Stock</label>
                <input type="number" value={totalStock} onChange={(e) => setTotalStock(e.target.value)} className={inputClass} placeholder="100" />
              </div>
              <div>
                <label className={labelClass}>Minimum Stock to Buy</label>
                <input type="number" value={minimumStock} onChange={(e) => setMinimumStock(e.target.value)} className={inputClass} placeholder="5" />
              </div>
              <div>
                <label className={labelClass}>Per Stock Price (₹) *</label>
                <input type="number" value={perStockPrice} onChange={(e) => setPerStockPrice(e.target.value)} required className={inputClass} placeholder="1000" />
              </div>
              <div>
                <label className={labelClass}>Minimum Stock Price (₹)</label>
                <input type="number" value={minimumStockPrice} onChange={(e) => setMinimumStockPrice(e.target.value)} className={inputClass} placeholder="5000" />
              </div>
              <div>
                <label className={labelClass}>Current Market Amount (₹)</label>
                <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} className={inputClass} placeholder="50000" />
              </div>
              <div>
                <label className={labelClass}>Duration (months) *</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required className={inputClass} placeholder="6" />
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Profit/Loss Margin (%)</label>
                <input type="number" value={profitLossMargin} onChange={(e) => setProfitLossMargin(e.target.value)} className={inputClass} placeholder="15" />
              </div>
              <div>
                <label className={labelClass}>P/L Percentage (%)</label>
                <input type="number" value={profitLossPercentage} onChange={(e) => setProfitLossPercentage(e.target.value)} className={inputClass} placeholder="18" />
              </div>
              <div>
                <label className={labelClass}>Ranking (1-5)</label>
                <input type="number" min="1" max="5" value={ranking} onChange={(e) => setRanking(e.target.value)} className={inputClass} placeholder="4" />
              </div>
              <div>
                <label className={labelClass}>Years in Market</label>
                <input type="number" value={yearsStayInMarket} onChange={(e) => setYearsStayInMarket(e.target.value)} className={inputClass} placeholder="3" />
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification & Trust</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Soil Test Done", state: soilTest, setter: setSoilTest },
                { label: "Document Verified", state: documentVerified, setter: setDocumentVerified },
                { label: "KYC Verified", state: kycVerified, setter: setKycVerified },
                { label: "Assured Returns", state: assured, setter: setAssured },
              ].map(({ label, state, setter }) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input type="checkbox" checked={state} onChange={(e) => setter(e.target.checked)} className="w-5 h-5 text-green-600 rounded" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50">
              {submitting ? "Creating..." : "Create Land Listing"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
