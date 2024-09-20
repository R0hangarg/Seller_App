import{ Types } from 'mongoose';

export interface Product  {
    sellerId: Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    category: string;
    images?: string[];
    sku: string;
    isActive:boolean
}

export interface ProductQuery {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}