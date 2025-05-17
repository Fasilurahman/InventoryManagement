import { ItemsReport } from '../../../domain/entities/Report';
import { IReportRepository } from '../../../domain/interfaces/IReportRepository';

export class GenerateItemsReportUseCase {
  constructor(private reportRepository: IReportRepository) {}

  async execute(category?: string): Promise<ItemsReport> {
    return this.reportRepository.generateItemsReport(category);
  }
}