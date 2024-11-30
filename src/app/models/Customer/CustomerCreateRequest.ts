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
