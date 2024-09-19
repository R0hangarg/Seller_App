import { Request, Response } from "express";
import { profileUpdateSchema } from "../validations/profileUpdate";
import sellerAccount from "../models/sellerModel";

export const updateSellerInfo = async (req: Request, res: Response) => {
    try {
        const { sellerId } = req.params;

        const { error } = profileUpdateSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                status: false,
                message: "validation failed",
                data: null,
                error: error
            })
        }

        const updatedUser = req.body;

        const updatedSeller = await sellerAccount.findByIdAndUpdate(sellerId, updatedUser, {
            new: true,
            runValidators: true
        })

        if (!updatedSeller) {
            return res.status(400).json({
                status: false,
                message: "Seller account not found",
                data: null,
                error: null
            })
        }

        return res.status(200).json({
            status: true,
            message: "Seller account updated successfully",
            data: updatedSeller,
            error: null
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error Updating the seller info",
            data: null,
            error: error
        })
    }

}