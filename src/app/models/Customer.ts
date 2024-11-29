export interface Customer {
  created: Date;
  firstName: string;
  lastName: string;
  email: string;
  primaryPhone: string;
  ext?: string;
  secondaryPhone?: string;
  fax?: string;
  billingAddressId: string;
}
