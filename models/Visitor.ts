import mongoose, { Schema, models, model } from "mongoose";

const VisitorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{10}$/,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    purpose: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    visitDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Visitor = models.Visitor || model("Visitor", VisitorSchema);

export default Visitor;
