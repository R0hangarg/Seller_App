interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface SocialMediaLink {
    platform: string;
    url: string;
}

export interface sellerType{
    businessName: string,
    email:string,
    password: string,
    phoneNumber:string,
    address: Address,
    emailVerified: boolean,
    verificationToken?: string,
    businessDescription: string,
    logoUrl?: string,
    website?: string,
    socialMediaLinks?: SocialMediaLink[],
}

export interface sellerLoginType{
    password:string,
    email:string,
}