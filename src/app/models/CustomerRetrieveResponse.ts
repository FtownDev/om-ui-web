import { Customer } from './Customer';
export interface CustomerRetrieveResponse {
  pageSize: number;
  totalCount: number;
  customers: Customer[];
}
