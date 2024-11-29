export interface Address {
  id?: string;
  street1: string;
  street2?: string;
  dependentLocality: string;
  locale: string;
  postalCode: string;
  countryId: string;
  country: string;
}
