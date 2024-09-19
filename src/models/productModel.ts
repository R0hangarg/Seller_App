import mongoose, { Schema } from 'mongoose'
import { Product } from '../interfaces/productSchemaInterface';

const productSchema = new Schema<Product>({
    name:{type:String , required:true},
    description:{type:String},
    price:{type:Number,required:true ,min:0},
    quantity:{type:Number , required:true,min:0 ,integer:true},
    category:{type:String , required:true},
    images: { type: [String], validate: {
        validator: (v: string[]) => v.every(url => /^https?:\/\//.test(url)),
        message: 'Invalid image URL format'
    }},
    sku: { type: String, required: true, unique: true },
})

const Product = mongoose.model('products',productSchema);

export default Product;