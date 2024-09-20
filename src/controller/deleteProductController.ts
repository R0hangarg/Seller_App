import { Request, Response } from "express";
import Product from "../models/productModel";

export const deleteProductController = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const sellerId = req.params.sellerId;

        const product = await Product.findOne({ _id: productId, sellerId });

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found",
                data: null,
                error: null
            });
        }

        //For hardDelete 
        await Product.findByIdAndDelete(productId);

        // For soft delete 
        //  product.isActive = false;
        //  await product.save();

        return res.status(200).json({
            status: true,
            message: "Product deleted Successfully",
            data: null,
            error: null
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error while deleting Product",
            data: null,
            error: error
        })
    }
}