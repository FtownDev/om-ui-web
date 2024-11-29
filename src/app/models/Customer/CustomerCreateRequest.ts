import { Address } from '../Address/Address';

export interface CustomerCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  primaryPhone: string;
  ext?: string;
  secondaryPhone?: string;
  fax?: string;
  billingAddress: Address;
}
/**
 {
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "primaryPhone": "string",
  "ext": "string",
  "secondaryPhone": "string",
  "fax": "string",
  "billingAddress": {
    "street1": "string",
    "street2": "string",
    "dependentLocality": "string",
    "locale": "string",
    "postalCode": "string",
    "countryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "country": "string"
  }
}
 */
