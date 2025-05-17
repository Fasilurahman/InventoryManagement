import { EmailService } from '../../../infrastructure/services/EmailService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportCustomer {
  customerId: string;
  customerName: string;
  itemsPurchased: number;
  totalSpent: number;
  purchaseDates: string[];
}

interface Report {
  customers: ReportCustomer[];
}

export class SendSalesReportEmailUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute(toEmail: string, report: Report): Promise<void> {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Sales Report', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Customer ID', 'Name', 'Items Purchased', 'Total Spent', 'Purchase Dates']],
      body: report.customers.map((customer) => [
        customer.customerId,
        customer.customerName,
        customer.itemsPurchased,
        customer.totalSpent,
        customer.purchaseDates.join(', '),
      ]),
    });

    const pdfBuffer = doc.output('arraybuffer');

    await this.emailService.sendEmailWithAttachment(
      toEmail,
      'Sales Report',
      'Attached is your requested sales report.',
      Buffer.from(pdfBuffer),
      'sales-report.pdf'
    );
  }
}
