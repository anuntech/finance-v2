import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface IWorkspace extends Document {
  id: mongoose.Schema.Types.ObjectId;
  name: string;
  color: string;
  type: "output" | "input" | "others";
  subCategories: {
    name: string;
  }[];
}

const workspaceSchema = new mongoose.Schema<IWorkspace>(
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

workspaceSchema.plugin(toJSON as any);

const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace ||
  mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;
