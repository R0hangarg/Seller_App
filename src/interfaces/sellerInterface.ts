interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface sellerType{
    businessName: string,
    email:string,
    password: string,
    phoneNumber:string,
    address: Address,
    emailVerified: boolean,
    verificationToken?: string,
}