import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'stock_buy', 'stock_sell', 'bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  referenceId: String // e.g. paymentId, withdrawRequestId, investmentId
}, {
  timestamps: true
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default Transaction;
