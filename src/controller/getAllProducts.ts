import { Request, Response } from "express";
import Product from "../models/productModel";
import { ProductQuery } from "../interfaces/productSchemaInterface";
import { Types } from "mongoose";

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