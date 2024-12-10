import { model, Schema } from "mongoose";

export const Order = model(
  "Order",
  new Schema({
    table: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["WAITING", "IN_PRODUCTION", "DONE"],
      default: "WAITING",
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    total: {
      type: Number,
      default: 0
    },
    products: {
      required: true,
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Product",
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
    },
  })
);
