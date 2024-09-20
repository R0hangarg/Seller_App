import { Request, Response } from "express";
import { updateProductValidation } from "../validations/productValidation";
import Product from "../models/productModel";

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { value: productInfo, error } = await updateProductValidation.validateAsync(req.body);

        if (error) {
            return res.status(400).json({
                status: false,
                message: "Validation error",
                data: null,
                error: null
            });
        }

        const sellerId = req.params.sellerId;
        const productId = req.params.productId;

        const productExists = await Product.findOne({ _id: productId, sellerId })

        if (!productExists) {
            return res.status(404).json({
                status: false,
                message: "Product not found",
                data: null,
                error: null
            });
        }

        if (productInfo.sku) {
            const existingSKU = await Product.findOne({ sku: productInfo.sku, sellerId });
            if (existingSKU && existingSKU._id.toString() !== productId) {
                return res.status(409).json({
                    status: false,
                    message: "SKU already exists for another product",
                    data: null,
                    error: null
                });
            }
        }
        const productCheck = await Product.findByIdAndUpdate(productId, productInfo, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: productCheck,
            error: null
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error updating product ",
            data: null,
            error: error
        })
    }
}