import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// ─── Inline Schemas (to avoid ESM import issues with Next.js models) ────────

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "farmer"], default: "user" },
  phone: { type: String, trim: true },
  avatar: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

const landSchema = new mongoose.Schema({
  landImage: String,
  landName: String,
  landPlace: String,
  landDescription: String,
  totalStock: Number,
  minimumStock: Number,
  perStockPrice: Number,
  minimumStockPrice: Number,
  seed: String,
  duration: Number,
  profitLossMargin: Number,
  soilTest: Boolean,
  documentVerified: Boolean,
  kycVerified: Boolean,
  ranking: Number,
  profitLossPercentage: Number,
  yearsStayInMarket: Number,
  assured: { type: Boolean, default: false },
  status: { type: String, default: "open" },
  previousAmounts: { type: [Number], default: [] },
  previousAmount: { type: Number, default: 0 },
  currentAmount: { type: Number, default: 0 },
}, { timestamps: true });

const investorSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: String,
  sharesOwned: { type: Number, required: true },
  investmentAmount: { type: Number, required: true },
  investmentDate: { type: Date, default: Date.now },
  returnAmount: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "completed", "withdrawn"], default: "active" },
});

const farmerShareSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  farmerImage: String,
  farmerLocation: String,
  farmerContact: String,
  farmerExperience: Number,
  farmName: String,
  farmLocation: { type: String, required: true },
  farmSize: Number,
  farmImages: [String],
  cropType: { type: String, required: true },
  seedVariety: String,
  farmingMethod: { type: String, enum: ["organic", "conventional", "hydroponic", "mixed"], default: "conventional" },
  totalShares: { type: Number, required: true },
  availableShares: { type: Number, required: true },
  pricePerShare: { type: Number, required: true },
  minimumShares: { type: Number, default: 1 },
  totalInvestmentRaised: { type: Number, default: 0 },
  targetAmount: Number,
  investors: [investorSchema],
  projectStartDate: Date,
  projectEndDate: Date,
  duration: Number,
  harvestDate: Date,
  expectedReturn: Number,
  actualReturn: { type: Number, default: 0 },
  profitLossMargin: Number,
  insuranceCovered: { type: Boolean, default: false },
  soilTestReport: Boolean,
  documentVerified: { type: Boolean, default: false },
  kycVerified: { type: Boolean, default: false },
  landOwnershipVerified: { type: Boolean, default: false },
  governmentApproved: { type: Boolean, default: false },
  ranking: { type: Number, min: 1, max: 5, default: 3 },
  previousProjectsCompleted: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  status: { type: String, enum: ["open", "funding", "in-progress", "harvesting", "completed", "closed"], default: "open" },
  assured: { type: Boolean, default: false },
  description: String,
  riskFactors: [String],
  milestones: [{ title: String, description: String, date: Date, completed: { type: Boolean, default: false } }],
  updates: [{ title: String, description: String, images: [String], date: { type: Date, default: Date.now } }],
}, { timestamps: true });

// ─── Models ─────────────────────────────────────────────────────────────────

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Land = mongoose.models.Land || mongoose.model("Land", landSchema);
const FarmerShare = mongoose.models.FarmerShare || mongoose.model("FarmerShare", farmerShareSchema);

// ─── Seed Data ──────────────────────────────────────────────────────────────

async function seed() {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) {
    console.error("❌ MONGO_URL not found in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URL, { bufferCommands: false });
  console.log("✅ Connected!\n");

  // ── 1. Admin Account ──────────────────────────────────────────────────────
  const adminEmail = "admin@agritrade.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log(`⚠️  Admin already exists: ${adminEmail}`);
  } else {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await User.create({
      name: "AgriTrade Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      phone: "9876543210",
      isVerified: true,
      isActive: true,
      lastLogin: new Date(),
    });
    console.log(`✅ Admin created: ${admin.email} (password: Admin@123)`);
  }

  // ── 2. Sample Lands ───────────────────────────────────────────────────────
  const lands = [
    {
      landName: "Green Valley Farmland",
      landPlace: "Thanjavur, Tamil Nadu",
      landDescription: "Fertile delta land ideal for paddy cultivation with excellent irrigation from Cauvery river canals. Consistently produces high-yield harvests.",
      landImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      totalStock: 1000,
      minimumStock: 10,
      perStockPrice: 500,
      minimumStockPrice: 5000,
      seed: "Paddy (IR-64)",
      duration: 6,
      profitLossMargin: 15,
      soilTest: true,
      documentVerified: true,
      kycVerified: true,
      ranking: 5,
      profitLossPercentage: 18,
      yearsStayInMarket: 4,
      assured: true,
      status: "open",
      previousAmounts: [420, 460, 485, 500],
      previousAmount: 485,
      currentAmount: 500,
    },
    {
      landName: "Sunrise Organic Farm",
      landPlace: "Coimbatore, Tamil Nadu",
      landDescription: "Organic certified farmland growing premium vegetables. Located in the western ghats foothills with natural spring water irrigation.",
      landImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      totalStock: 500,
      minimumStock: 5,
      perStockPrice: 1200,
      minimumStockPrice: 6000,
      seed: "Mixed Vegetables (Organic)",
      duration: 4,
      profitLossMargin: 22,
      soilTest: true,
      documentVerified: true,
      kycVerified: true,
      ranking: 4,
      profitLossPercentage: 25,
      yearsStayInMarket: 3,
      assured: true,
      status: "open",
      previousAmounts: [1000, 1050, 1150, 1200],
      previousAmount: 1150,
      currentAmount: 1200,
    },
    {
      landName: "Golden Harvest Fields",
      landPlace: "Madurai, Tamil Nadu",
      landDescription: "Well-maintained agricultural land with drip irrigation setup, ideal for sugarcane and banana cultivation. Government-subsidized water supply.",
      landImage: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
      totalStock: 750,
      minimumStock: 10,
      perStockPrice: 800,
      minimumStockPrice: 8000,
      seed: "Sugarcane (Co-86032)",
      duration: 12,
      profitLossMargin: 20,
      soilTest: true,
      documentVerified: true,
      kycVerified: false,
      ranking: 3,
      profitLossPercentage: 22,
      yearsStayInMarket: 2,
      assured: false,
      status: "open",
      previousAmounts: [700, 750, 780, 800],
      previousAmount: 780,
      currentAmount: 800,
    },
  ];

  const landCount = await Land.countDocuments();
  if (landCount > 0) {
    console.log(`⚠️  ${landCount} lands already exist — skipping land seed`);
  } else {
    const created = await Land.insertMany(lands);
    console.log(`✅ ${created.length} lands created:`);
    created.forEach((l) => console.log(`   - ${l.landName} (${l.landPlace})`));
  }

  // ── 3. Sample Farmer Shares ───────────────────────────────────────────────
  const farmerShares = [
    {
      farmerName: "Rajan Krishnamoorthy",
      farmerLocation: "Thanjavur, Tamil Nadu",
      farmerContact: "9876501234",
      farmerExperience: 15,
      farmName: "Rajan's Paddy Estate",
      farmLocation: "Thanjavur, Tamil Nadu",
      farmSize: 25,
      cropType: "Paddy",
      seedVariety: "Ponni (Traditional)",
      farmingMethod: "conventional",
      totalShares: 500,
      availableShares: 420,
      pricePerShare: 1000,
      minimumShares: 5,
      totalInvestmentRaised: 80000,
      targetAmount: 500000,
      duration: 6,
      projectStartDate: new Date("2026-07-01"),
      projectEndDate: new Date("2026-12-31"),
      harvestDate: new Date("2026-12-15"),
      expectedReturn: 18,
      profitLossMargin: 15,
      insuranceCovered: true,
      soilTestReport: true,
      documentVerified: true,
      kycVerified: true,
      landOwnershipVerified: true,
      governmentApproved: true,
      ranking: 5,
      previousProjectsCompleted: 8,
      successRate: 95,
      status: "funding",
      assured: true,
      description: "Premium Ponni paddy cultivation in the fertile Cauvery delta. Rajan has 15+ years of farming experience with an excellent track record of delivering returns to investors.",
      riskFactors: ["Monsoon dependency", "Pest infestation"],
      milestones: [
        { title: "Land Preparation", description: "Soil testing and ploughing complete", date: new Date("2026-07-01"), completed: false },
        { title: "Sowing", description: "Paddy sowing begins", date: new Date("2026-07-15"), completed: false },
        { title: "Harvest", description: "Final harvest and distribution", date: new Date("2026-12-15"), completed: false },
      ],
    },
    {
      farmerName: "Lakshmi Devi",
      farmerLocation: "Erode, Tamil Nadu",
      farmerContact: "9876509876",
      farmerExperience: 10,
      farmName: "Lakshmi Organic Gardens",
      farmLocation: "Erode, Tamil Nadu",
      farmSize: 12,
      cropType: "Turmeric",
      seedVariety: "Erode Local",
      farmingMethod: "organic",
      totalShares: 300,
      availableShares: 300,
      pricePerShare: 1500,
      minimumShares: 3,
      totalInvestmentRaised: 0,
      targetAmount: 450000,
      duration: 9,
      projectStartDate: new Date("2026-08-01"),
      projectEndDate: new Date("2027-04-30"),
      harvestDate: new Date("2027-04-15"),
      expectedReturn: 25,
      profitLossMargin: 22,
      insuranceCovered: true,
      soilTestReport: true,
      documentVerified: true,
      kycVerified: true,
      landOwnershipVerified: true,
      governmentApproved: false,
      ranking: 4,
      previousProjectsCompleted: 5,
      successRate: 90,
      status: "open",
      assured: false,
      description: "Organic turmeric cultivation in the renowned Erode region. Lakshmi specialises in organic farming methods and produces premium quality turmeric with high curcumin content.",
      riskFactors: ["Price fluctuation", "Storage requirements"],
      milestones: [
        { title: "Seed Procurement", description: "Sourcing premium organic turmeric seeds", date: new Date("2026-08-01"), completed: false },
        { title: "Planting", description: "Turmeric planting in prepared beds", date: new Date("2026-08-15"), completed: false },
        { title: "Harvest & Processing", description: "Harvesting, boiling, and drying turmeric", date: new Date("2027-04-15"), completed: false },
      ],
    },
    {
      farmerName: "Murugan Selvaraj",
      farmerLocation: "Dindigul, Tamil Nadu",
      farmerContact: "9876504567",
      farmerExperience: 20,
      farmName: "Murugan Banana Plantation",
      farmLocation: "Dindigul, Tamil Nadu",
      farmSize: 30,
      cropType: "Banana",
      seedVariety: "Nendran",
      farmingMethod: "conventional",
      totalShares: 800,
      availableShares: 650,
      pricePerShare: 750,
      minimumShares: 10,
      totalInvestmentRaised: 112500,
      targetAmount: 600000,
      duration: 10,
      projectStartDate: new Date("2026-06-15"),
      projectEndDate: new Date("2027-04-15"),
      harvestDate: new Date("2027-03-30"),
      expectedReturn: 20,
      profitLossMargin: 18,
      insuranceCovered: false,
      soilTestReport: true,
      documentVerified: true,
      kycVerified: true,
      landOwnershipVerified: true,
      governmentApproved: true,
      ranking: 4,
      previousProjectsCompleted: 12,
      successRate: 92,
      status: "in-progress",
      assured: true,
      description: "Large-scale Nendran banana plantation in the ideal climate of Dindigul. Murugan is a veteran farmer with 20 years of experience and 12 successfully completed investor projects.",
      riskFactors: ["Cyclone risk", "Disease outbreak", "Market price volatility"],
      milestones: [
        { title: "Planting Complete", description: "All banana suckers planted", date: new Date("2026-06-30"), completed: true },
        { title: "Growth Phase", description: "Regular fertilisation and maintenance", date: new Date("2026-10-01"), completed: false },
        { title: "Harvest", description: "Banana harvest and market distribution", date: new Date("2027-03-30"), completed: false },
      ],
    },
  ];

  const shareCount = await FarmerShare.countDocuments();
  if (shareCount > 0) {
    console.log(`⚠️  ${shareCount} farmer shares already exist — skipping share seed`);
  } else {
    const created = await FarmerShare.insertMany(farmerShares);
    console.log(`✅ ${created.length} farmer shares created:`);
    created.forEach((s) => console.log(`   - ${s.farmerName} — ${s.cropType} (${s.status})`));
  }

  // ── Done ───────────────────────────────────────────────────────────────────
  console.log("\n🎉 Seed complete!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
