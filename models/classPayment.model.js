import mongoose from "mongoose";
const { Schema } = mongoose;

const classPaymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    cartItems: [
      {
        cartItemId: { type: Schema.Types.ObjectId, required: true },
        productId: {
          type: Schema.Types.ObjectId,
          ref: "YogaAccessory",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["khalti", null],
      default: null,
    },
    paymentDate: {
      type: Date,
    },
    pidx: {
      type: String,
    },
    transactionId: {
      type: String,
    },
  },
  { timestamps: true }
);

const ClassPayment =
  mongoose.models.ClassPayment ||
  mongoose.model("ClassPayment", classPaymentSchema);
export default ClassPayment;
