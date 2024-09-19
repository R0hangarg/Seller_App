import mongoose, { Schema } from "mongoose";
import { sellerType } from "../interfaces/sellerInterface";

const sellerSchema = new Schema<sellerType>({
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    businessDescription: { type: String },
    logoUrl: { type: String, match: /^https?:\/\// }, // Validate URL
    website: { type: String, match: /^https?:\/\// }, // Validate URL
    socialMediaLinks: [
        {
            platform: { type: String, required: true },
            url: { type: String, match: /^https?:\/\//, required: true }, // Validate URL
        }
    ],
})

const sellerAccount = mongoose.model<sellerType>('sellerAccount', sellerSchema);

export default sellerAccount;