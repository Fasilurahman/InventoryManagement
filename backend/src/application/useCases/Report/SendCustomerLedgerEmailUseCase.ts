import { EmailService } from '../../../infrastructure/services/EmailService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportCustomer {
  customerId: string;
  customerName: string;
  email: string;
  totalItemsBought: number;
  totalSpent: number;
  lastPurchaseDate: string;
}

interface Report {
  customers: ReportCustomer[];
}

export class SendCustomerLedgerEmailUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute(toEmail: string, report: Report): Promise<void> {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Customer Ledger Report', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Customer ID', 'Name', 'Email', 'Items Bought', 'Total Spent', 'Last Purchase']],
      body: report.customers.map((customer) => [
        customer.customerId,
        customer.customerName,
        customer.email,
        customer.totalItemsBought,
        customer.totalSpent,
        new Date(customer.lastPurchaseDate).toLocaleDateString(),
      ]),
    });

    const pdfBuffer = doc.output('arraybuffer');

    await this.emailService.sendEmailWithAttachment(
      toEmail,
      'Customer Ledger Report',
      'Attached is the customer ledger report.',
      Buffer.from(pdfBuffer),
      'customer-ledger-report.pdf'
    );
  }
}
