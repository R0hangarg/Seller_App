import { Request, Response } from "express";
import Product from "../models/productModel";
import { productValidation } from "../validations/productValidation";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await productValidation.validateAsync(req.body);

        const sellerId = req.params.sellerId;

        const existingProduct = await Product.findOne({ sellerId });

        if (existingProduct) {
            return res.status(400).json({
                status: false,
                message: 'SKU already exists for this seller',
                data: null,
                error: null
            });
        }

        const newProduct = new Product({
            sellerId: sellerId,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            images: product.images,
            sku: product.sku,
        });

        const savedProduct = await newProduct.save();

        res.status(200).json({
            status: true,
            message: 'Product created successfully',
            data: savedProduct,
            error: null
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error Creating Product',
            data: null,
            error: error
        });
    }
}