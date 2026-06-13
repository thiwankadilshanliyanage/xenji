import mongoose from "mongoose";

const multilingualText = {
  en: {
    type: String,
    trim: true,
    required: true,
  },
  ja: {
    type: String,
    trim: true,
    default: "",
  },
};

const serviceSchema = new mongoose.Schema(
  {
    title: multilingualText,
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    shortDescription: multilingualText,
    fullDescription: multilingualText,
    companyName: String,
    websiteUrl: String,
    contactEmail: String,
    phoneNumber: String,
    postalCode: String,
    prefecture: String,
    city: String,
    address: String,
    googleMapsLink: String,
    languagesSupported: [String],
    priceInfo: String,
    workingHours: String,
    thumbnailImage: String,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

serviceSchema.index({
  "title.en": "text",
  "title.ja": "text",
  "shortDescription.en": "text",
  "shortDescription.ja": "text",
  category: "text",
  prefecture: "text",
  city: "text",
});

export default mongoose.model("Service", serviceSchema);
