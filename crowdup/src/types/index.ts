export interface ICampaign {
  _id: string;
  title: string;
  description: string;
  amount: number;
  targetAmount: number;
  profilePicture: string; // Include this field
  location: {
    country: string;
    city: string;
  };
  deadline: number;
  organizerContact: string;
  campaignType: string;
  organizationName: string;
  organizationEmail: string;
  contactPersonName: string;
  // status: string;
  createdAt: string;
  // updatedAt: string;
}

export interface ITestimonial {
  id: string;
  testimonial: string;
  createdBy: string;
  createdByImage: string;
  company: string;
  jobPosition: string;
}

export interface ICountry {
  name: string;
  code: string;
  emoji: string;
  unicode: string;
  image: string;
}

export interface ICurrency {
  cc: string;
  symbol: string;
  name: string;
}
