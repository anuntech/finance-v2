import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface ICategory extends Document {
  id: mongoose.Schema.Types.ObjectId;
  name: string;
  color: string;
  type: "output" | "input" | "others";
  subCategories: {
    name: string;
  }[];
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, trim: true, required: true, maxlength: 50 },
    color: {
      type: String,
      match: /^#([0-9a-fA-F]{3}){1,2}$/, // hexadecimal
    },
    type: {
      type: String,
      enum: ["output", "input", "others"],
      required: true,
    },
    subCategories: {
      name: {
        type: String,
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
);

categorySchema.plugin(toJSON as any);

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);

export default Category;
