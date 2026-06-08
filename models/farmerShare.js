import mongoose, { Schema } from "mongoose";

const investorSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  userName: String,
  sharesOwned: {
    type: Number,
    required: true
  },
  investmentAmount: {
    type: Number,
    required: true
  },
  investmentDate: {
    type: Date,
    default: Date.now
  },
  returnAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["active", "completed", "withdrawn"],
    default: "active"
  }
});

const farmerShareSchema = new Schema({
  // Farmer Information
  farmerName: {
    type: String,
    required: true
  },
  farmerImage: String,
  farmerLocation: String,
  farmerContact: String,
  farmerExperience: Number, // years of farming experience
  
  // Farm Details
  farmName: String,
  farmLocation: {
    type: String,
    required: true
  },
  farmSize: Number, // in acres
  farmImages: [String],
  cropType: {
    type: String,
    required: true
  },
  seedVariety: String,
  farmingMethod: {
    type: String,
    enum: ["organic", "conventional", "hydroponic", "mixed"],
    default: "conventional"
  },
  
  // Share Information
  totalShares: {
    type: Number,
    required: true
  },
  availableShares: {
    type: Number,
    required: true
  },
  pricePerShare: {
    type: Number,
    required: true
  },
  minimumShares: {
    type: Number,
    default: 1
  },
  
  // Investment Tracking
  totalInvestmentRaised: {
    type: Number,
    default: 0
  },
  targetAmount: Number,
  investors: [investorSchema],
  
  // Project Timeline
  projectStartDate: Date,
  projectEndDate: Date,
  duration: Number, // in months
  harvestDate: Date,
  
  // Financial Details
  expectedReturn: Number, // percentage
  actualReturn: {
    type: Number,
    default: 0
  },
  profitLossMargin: Number,
  insuranceCovered: {
    type: Boolean,
    default: false
  },
  
  // Verification & Trust
  soilTestReport: Boolean,
  documentVerified: {
    type: Boolean,
    default: false
  },
  kycVerified: {
    type: Boolean,
    default: false
  },
  landOwnershipVerified: {
    type: Boolean,
    default: false
  },
  governmentApproved: {
    type: Boolean,
    default: false
  },
  
  // Rating & Performance
  ranking: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  previousProjectsCompleted: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  }, // percentage
  
  // Status
  status: {
    type: String,
    enum: ["open", "funding", "in-progress", "harvesting", "completed", "closed"],
    default: "open"
  },
  stage: {
    type: String,
    default: "Preparation of soil"
  },
  assured: {
    type: Boolean,
    default: false
  },
  
  // Additional Information
  description: String,
  riskFactors: [String],
  milestones: [{
    title: String,
    description: String,
    date: Date,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  updates: [{
    title: String,
    description: String,
    images: [String],
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Calculate available shares before saving
farmerShareSchema.pre('save', function(next) {
  if (this.investors && this.investors.length > 0) {
    const activeInvestors = this.investors.filter(inv => inv.status !== 'withdrawn');
    const totalInvestedShares = activeInvestors.reduce((sum, inv) => sum + inv.sharesOwned, 0);
    this.availableShares = this.totalShares - totalInvestedShares;
    this.totalInvestmentRaised = activeInvestors.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  }
  next();
});

const FarmerShare = mongoose.models.FarmerShare || mongoose.model("FarmerShare", farmerShareSchema);
export default FarmerShare;
