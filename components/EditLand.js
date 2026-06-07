"use client";
import { UploadButton } from "../src/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditLand({ id, Land }) {
  const [landImage, setLandImage] = useState(Land.landImage || "");
  const [landName, setLandName] = useState(Land.landName || "");
  const [landPlace, setLandPlace] = useState(Land.landPlace || "");
  const [landDescription, setLandDescription] = useState(Land.landDescription || "");
  const [totalStock, setTotalStock] = useState(Land.totalStock || "");
  const [minimumStock, setMinimumStock] = useState(Land.minimumStock || "");
  const [perStockPrice, setPerStockPrice] = useState(Land.perStockPrice || "");
  const [minimumStockPrice, setMinimumStockPrice] = useState(Land.minimumStockPrice || "");
  const [seed, setSeed] = useState(Land.seed || "");
  const [duration, setDuration] = useState(Land.duration || "");
  const [profitLossMargin, setProfitLossMargin] = useState(Land.profitLossMargin || "");
  const [soilTest, setSoilTest] = useState(Land.soilTest || false);
  const [documentVerified, setDocumentVerified] = useState(Land.documentVerified || false);
  const [kycVerified, setKycVerified] = useState(Land.kycVerified || false);
  const [ranking, setRanking] = useState(Land.ranking || "");
  const [profitLossPercentage, setProfitLossPercentage] = useState(Land.profitLossPercentage || "");
  const [yearsStayInMarket, setYearsStayInMarket] = useState(Land.yearsStayInMarket || "");
  const [status, setStatus] = useState(Land.status || "open");
  const [assured, setAssured] = useState(Land.assured || false);
  const [currentAmount, setCurrentAmount] = useState(Land.currentAmount || "");
  const [submitting, setSubmitting] = useState(false);

  const previousAmount = Land.currentAmount;
  const previousAmounts = Land.previousAmounts || [];

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const updatedPreviousAmounts = [...previousAmounts, previousAmount];

    try {
      const res = await fetch(`/api/land/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          landImage, landName, landPlace, landDescription,
          totalStock: Number(totalStock), minimumStock: Number(minimumStock),
          perStockPrice: Number(perStockPrice), minimumStockPrice: Number(minimumStockPrice),
          seed, duration: Number(duration), profitLossMargin: Number(profitLossMargin),
          soilTest, documentVerified, kycVerified,
          ranking: Number(ranking), profitLossPercentage: Number(profitLossPercentage),
          yearsStayInMarket: Number(yearsStayInMarket),
          assured, status, previousAmount, currentAmount: Number(currentAmount),
          previousAmounts: updatedPreviousAmounts,
        }),
      });

      if (res.status === 200) {
        router.push("/admin/lands");
      } else {
        throw new Error("Failed to update land");
      }
    } catch (error) {
      console.error("Error updating land:", error);
      alert("Failed to update. Please try again.");
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Land Listing</h1>
          <button
            type="button"
            onClick={() => router.push('/admin/lands')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
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
                <textarea value={landDescription} onChange={(e) => setLandDescription(e.target.value)} rows={3} className={inputClass} placeholder="Describe the land..." />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                  <option value="open">Open</option>
                  <option value="land">Land Prep</option>
                  <option value="seed">Seeding</option>
                  <option value="water">Watering</option>
                  <option value="pesticide">Pesticide</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="farmer">Farmer Work</option>
                  <option value="harvest">Harvest</option>
                  <option value="store">Storage</option>
                  <option value="sell">Selling</option>
                  <option value="closed">Closed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Seed Type</label>
                <input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} className={inputClass} placeholder="e.g. Wheat, Rice" />
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
                <label className={labelClass}>Minimum Stock</label>
                <input type="number" value={minimumStock} onChange={(e) => setMinimumStock(e.target.value)} className={inputClass} placeholder="5" />
              </div>
              <div>
                <label className={labelClass}>Per Stock Price (₹)</label>
                <input type="number" value={perStockPrice} onChange={(e) => setPerStockPrice(e.target.value)} className={inputClass} placeholder="1000" />
              </div>
              <div>
                <label className={labelClass}>Minimum Stock Price (₹)</label>
                <input type="number" value={minimumStockPrice} onChange={(e) => setMinimumStockPrice(e.target.value)} className={inputClass} placeholder="5000" />
              </div>
              <div>
                <label className={labelClass}>Current Amount (₹)</label>
                <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} className={inputClass} placeholder="50000" />
              </div>
              <div>
                <label className={labelClass}>Duration (months)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="6" />
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

          {/* Actions */}
          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => router.push('/admin/lands')} className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
