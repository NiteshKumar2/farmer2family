import mongoose, { Schema, models, model } from "mongoose";

const VisitorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    purpose: {
      type: String,
      trim: true,
    },

    visitDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = models.Visitor || model("Visitor", VisitorSchema);

export default Visitor;
