export class CompanyDetails {
    id:number;
    companyName: string;
    userName: string;
    email: string = '';
    password: any;
    confirmpassword: any;
    licenseType: string = '';
    licenseExpired: Date;
    numberOfUserAllowed: number;
    industryTypeID: string;
    phoneNumber:number;
    amount:number;
    createdDate:Date;
    active:number;
    secondIndustryTypeID: string;
    logoPath: string = '';
    logoName: string = '';
    companyBio: string;
    countryCode: string = '';
    location: string;
    name: string;
    dialCode: string;
    currencySymbol:string;
    categories:any[]
    expiration:any;
    package_name :string;

}
