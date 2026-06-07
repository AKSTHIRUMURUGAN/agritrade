import mongoose,{ Schema } from "mongoose";
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

const landSchema = new Schema({
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
    assured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: "open"
    },
    previousAmounts:{
     type:[Number],
     default:[]
    },
    previousAmount: {
      type: Number,
      default: 0 // Default value if not provided
    },
    currentAmount: {
      type: Number,
      default: 0 // Default value if not provided
    },
    investors: [investorSchema]
  },{
    timestamps:true
  });
  const Land=mongoose.models.Land||mongoose.model("Land",landSchema);
  export default Land;