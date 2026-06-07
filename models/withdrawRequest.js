import mongoose, { Schema } from 'mongoose';

const withdrawRequestSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String
  },
  userEmail: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['UPI', 'Bank Transfer', 'Paytm'],
    default: 'UPI'
  },
  paymentDetails: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const WithdrawRequest = mongoose.models.WithdrawRequest || mongoose.model('WithdrawRequest', withdrawRequestSchema);
export default WithdrawRequest;
