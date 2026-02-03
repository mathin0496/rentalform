
export enum Province {
  AB = 'Alberta',
  BC = 'British Columbia',
  MB = 'Manitoba',
  NB = 'New Brunswick',
  NL = 'Newfoundland and Labrador',
  NS = 'Nova Scotia',
  ON = 'Ontario',
  PE = 'Prince Edward Island',
  QC = 'Quebec',
  SK = 'Saskatchewan',
  NT = 'Northwest Territories',
  NU = 'Nunavut',
  YT = 'Yukon'
}

export enum RentalPropertyType {
  APARTMENT = 'Apartment',
  CONDO = 'Condo',
  BASEMENT = 'Basement Suite',
  DETACHED = 'Detached House',
  TOWNHOUSE = 'Townhouse',
  ROOM = 'Shared Room'
}

export interface AttachedFile {
  name: string;
  type: string;
  base64: string;
}

export interface InquiryFormState {
  province: string;
  city: string;
  propertyType: RentalPropertyType | '';
  monthlyBudget: number;
  bedrooms: string;
  moveInDate: string;
  pets: boolean;
  email: string;
  phone: string;
  creditScore: string; 
  // Document selection
  requestedDocs: {
    passport: boolean;
    workPermit: boolean;
    employmentLetter: boolean;
    creditReport: boolean;
  };
  // Actual files
  files: {
    passport?: AttachedFile;
    workPermit?: AttachedFile;
    employmentLetter?: AttachedFile;
    creditReport?: AttachedFile;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
