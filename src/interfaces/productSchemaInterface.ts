export interface Product  {
    sellerId: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    category: string;
    images?: string[];
    sku: string;
}