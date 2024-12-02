import { Address } from './Address';

export interface AddressRetreiveResponse {
  customerId: string;
  shippingAddresses: Address[];
}
