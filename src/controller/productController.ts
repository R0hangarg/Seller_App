import { Request, Response } from "express";
import Product from "../models/productModel";
import { productValidation } from "../validations/productValidation";
import { updateProductValidation } from "../validations/productValidation";
import { Types } from "mongoose";
import { ProductQuery } from "../interfaces/productSchemaInterface";


// Controller To create new Product
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

//Controller to update Product 
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const productInfo = await updateProductValidation.validateAsync(req.body);
        if (!productInfo) {
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

//Controller to delete Product 
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

//Controller to getAllProducts 
export const getAllProducts = async(req:Request,res:Response)=>{
    try {
        
        const sellerId = req.params.sellerId;
        const { page = 1, limit = 20, search, category } = req.query as ProductQuery;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber-1) * limit ;

        const filter : any ={sellerId: new Types.ObjectId(sellerId)}


        if(category){
            filter.category = category;
        }
        if(search){
            filter.name = search;
        }

        const products  =  await Product.find(filter).skip(skip).limit(limit)
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNumber);
        
        res.status(200).json({
            status:true,
            message:"Products fetched successfully",
            data: products,
            error:null,
            metadata:{
                totalProducts,
                totalPages,
                currentPage: pageNumber
            },
            
        })

    } catch (error) {
        return res.status(500).json({
            status:false,
            message:"Error while fetching products",
            data:null,
            error:error
        })
    }
}