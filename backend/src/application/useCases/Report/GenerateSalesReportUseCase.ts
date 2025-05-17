import { SalesReport } from '../../../domain/entities/Report';
import { IReportRepository } from '../../../domain/interfaces/IReportRepository';

export class GenerateSalesReportUseCase {
  constructor(private reportRepository: IReportRepository) {}

  async execute(startDate: Date, endDate: Date): Promise<SalesReport> {
    return this.reportRepository.generateSalesReport(startDate, endDate);
  }
}