import { SalesReport, ItemsReport, CustomerLedger } from '../entities/Report';

export interface IReportRepository {
  generateSalesReport(startDate: Date, endDate: Date): Promise<SalesReport>;
  generateItemsReport(category?: string): Promise<ItemsReport>;
  getCustomerLedger(startDate: Date, endDate: Date): Promise<CustomerLedger[]>;

}