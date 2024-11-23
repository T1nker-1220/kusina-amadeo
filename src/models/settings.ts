import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      default: "Kusina De Amadeo",
    },
    storeEmail: {
      type: String,
      required: true,
      default: "kusinadeamadeo@gmail.com",
    },
    storePhone: {
      type: String,
      default: "",
    },
    storeAddress: {
      type: String,
      default: "",
    },
    orderNotifications: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
