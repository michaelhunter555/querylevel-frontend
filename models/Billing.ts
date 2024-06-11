import mongoose from "mongoose";

export interface UserBilling extends mongoose.Document {
  stripeCustomerId: mongoose.Schema.Types.ObjectId;
  amountPaid: number;
  billingReason: string;
  chargeId: string;
  periodEnd: number;
  periodStart: number;
}

const BillingSchema = new mongoose.Schema<UserBilling>({
  stripeCustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Google",
  },
  amountPaid: { type: Number, required: false, default: 0 },
  billingReason: { type: String, required: false, default: "" },
  chargeId: { type: String, required: false, default: "" },
  periodEnd: { type: Number, required: false, default: 0 },
  periodStart: { type: Number, required: false, default: 0 },
});

export default mongoose.models.UserBilling ||
  mongoose.model<UserBilling>("UserBilling", BillingSchema);
