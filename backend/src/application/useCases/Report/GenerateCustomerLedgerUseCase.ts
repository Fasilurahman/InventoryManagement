import { IReportRepository } from '../../../domain/interfaces/IReportRepository';

export class GenerateCustomerLedgerUseCase {
  constructor(
    private reportRepository: IReportRepository,
  ) {}

  async execute(startDate: Date, endDate: Date) {
    return await this.reportRepository.getCustomerLedger(startDate, endDate);
  }
}