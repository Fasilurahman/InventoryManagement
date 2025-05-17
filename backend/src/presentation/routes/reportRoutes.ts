import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();
const reportController = new ReportController();

  

router.get('/report/sales', (req, res, next) => reportController.generateSalesReport(req, res, next));

router.get('/report/items', (req, res, next) => reportController.generateItemsReport(req, res, next));

router.get('/report/ledger', (req, res, next) => reportController.generateCustomerLedger(req, res, next));
router.post('/report/send-email', reportController.sendSalesReportEmail.bind(reportController));
router.post('/report/send-item-email', reportController.sendItemReportEmail.bind(reportController));
router.post('/report/send-customer-ledger-email', reportController.sendCustomerLedgerEmail.bind(reportController));




export default router;