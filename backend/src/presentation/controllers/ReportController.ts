import { Request, Response, NextFunction } from 'express';
import { GenerateSalesReportUseCase } from '../../application/useCases/Report/GenerateSalesReportUseCase';
import { GenerateItemsReportUseCase } from '../../application/useCases/Report/GenerateItemsReportUseCase';
import { GenerateCustomerLedgerUseCase } from '../../application/useCases/Report/GenerateCustomerLedgerUseCase';
import { ReportRepository } from '../../infrastructure/database/repositories/ReportRepository';
import { SendSalesReportEmailUseCase } from '../../application/useCases/Report/SendSalesReportEmailUseCase';
import { EmailService } from '../../infrastructure/services/EmailService';
import { SendItemReportEmailUseCase } from '../../application/useCases/Report/SendItemReportEmailUseCase';
import { SendCustomerLedgerEmailUseCase } from '../../application/useCases/Report/SendCustomerLedgerEmailUseCase';


export class ReportController {
  private generateSalesReportUseCase: GenerateSalesReportUseCase;
  private generateItemsReportUseCase: GenerateItemsReportUseCase;
  private generateCustomerLedgerUseCase: GenerateCustomerLedgerUseCase;
  private reportRepository: ReportRepository;
  private sendSalesReportEmailUseCase: SendSalesReportEmailUseCase;
  private emailService: EmailService;
  private sendItemReportEmailUseCase: SendItemReportEmailUseCase;
  private sendCustomerLedgerEmailUseCase: SendCustomerLedgerEmailUseCase;


  constructor() {
    this.reportRepository = new ReportRepository();
    this.emailService = new EmailService();
    this.generateSalesReportUseCase = new GenerateSalesReportUseCase(this.reportRepository);
    this.generateItemsReportUseCase = new GenerateItemsReportUseCase(this.reportRepository);
    this.generateCustomerLedgerUseCase = new GenerateCustomerLedgerUseCase(this.reportRepository);
    this.sendSalesReportEmailUseCase = new SendSalesReportEmailUseCase(this.emailService);
    this.sendItemReportEmailUseCase = new SendItemReportEmailUseCase(this.emailService);
    this.sendCustomerLedgerEmailUseCase = new SendCustomerLedgerEmailUseCase(this.emailService);

  }

  async generateSalesReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({ error: 'Start date and end date are required' });
        return;
      }
      
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
      }
      
      const report = await this.generateSalesReportUseCase.execute(start, end);
      
      res.status(200).json({ report });
    } catch (error) {
      next(error);
    }
  }

  async generateItemsReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.query;
      
      const report = await this.generateItemsReportUseCase.execute(category as string | undefined);
      res.status(200).json({ report });
    } catch (error) {
      next(error);
    }
  }

  async generateCustomerLedger(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.query);
      console.log('generateCustomerLedger');
      const { startDate, endDate } = req.query;
  
      if (!startDate || !endDate) {
        res.status(400).json({ error: 'Start date and end date are required' });
        return;
      }
  
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
  
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
      }
  
      const report = await this.generateCustomerLedgerUseCase.execute(start, end);
      console.log('report',report)
      res.status(200).json({ report });
    } catch (error) {
      next(error);
    }
  }

  async sendSalesReportEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { toEmail, report } = req.body;
  
      if (!toEmail || !report) {
        res.status(400).json({ error: 'Email and report data are required' });
        return;
      }
  
      await this.sendSalesReportEmailUseCase.execute(toEmail, report);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      next(error);
    }
  }

  async sendItemReportEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { toEmail, report } = req.body;
  
      if (!toEmail || !report) {
        res.status(400).json({ error: 'Email and report data are required' });
        return;
      }
      await this.sendItemReportEmailUseCase.execute(toEmail, report);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      next(error);
    }
  }  

  async sendCustomerLedgerEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { toEmail, report } = req.body;
  
      if (!toEmail || !report) {
        res.status(400).json({ error: 'Email and report data are required' });
        return;
      }
  
      await this.sendCustomerLedgerEmailUseCase.execute(toEmail, report);
      res.status(200).json({ message: 'Customer ledger email sent successfully' });
    } catch (error) {
      next(error);
    }
  }
  
}