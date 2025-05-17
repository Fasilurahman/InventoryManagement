import { EmailService } from '../../../infrastructure/services/EmailService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
}

interface Report {
  items: ReportItem[];
}

export class SendItemReportEmailUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute(toEmail: string, report: Report): Promise<void> {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Item Report', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Item ID', 'Name', 'Quantity', 'Price', 'Added Date']],
      body: report.items.map((item) => [
        item.id,
        item.name,
        item.quantity,
        item.price,
        new Date(item.createdAt).toLocaleDateString(),
      ]),
    });

    const pdfBuffer = doc.output('arraybuffer');

    await this.emailService.sendEmailWithAttachment(
      toEmail,
      'Item Report',
      'Attached is your requested item report.',
      Buffer.from(pdfBuffer),
      'item-report.pdf'
    );
  }
}
