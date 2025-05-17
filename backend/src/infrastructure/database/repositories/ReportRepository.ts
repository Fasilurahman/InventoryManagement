// infrastructure/database/repositories/ReportRepository.ts
import { IReportRepository } from '../../../domain/interfaces/IReportRepository';
import { SalesReport, ItemsReport, CustomerLedger, CustomerSalesSummary, ItemReportEntry, CustomerTransaction } from '../../../domain/entities/Report';
import { CustomerModel } from '../models/CustomerModel';
import { InventoryModel } from '../models/InventoryModel';
import mongoose from 'mongoose';

export class ReportRepository implements IReportRepository {
    async generateSalesReport(startDate: Date, endDate: Date): Promise<SalesReport> {
        const inventories = await InventoryModel.find({
          purchasedAt: { $gte: startDate, $lte: endDate },
          purchasedBy: { $exists: true, $ne: [] }, // ensure there are purchases
        });
      
        const customerPurchasesMap: Record<string, { item: any; purchasedAt: Date }[]> = {};
      
        for (const item of inventories) {
          const purchasedAt = item.purchasedAt;
          for (const customerId of item.purchasedBy) {
            const idStr = customerId.toString();
            if (!customerPurchasesMap[idStr]) customerPurchasesMap[idStr] = [];
            customerPurchasesMap[idStr].push({ item, purchasedAt });
          }
        }
      
        const involvedCustomerIds = Object.keys(customerPurchasesMap);
        const customers = await CustomerModel.find({ _id: { $in: involvedCustomerIds } });
      
        const customerSummaries = customers.map(customer => {
          const purchases = customerPurchasesMap[customer._id.toString()] || [];
      
          const totalSpent = purchases.reduce(
            (sum, p) => sum + (p.item.price * p.item.quantity),
            0
          );
      
          const purchaseDates = purchases.map(p => p.purchasedAt);
      
          return new CustomerSalesSummary(
            customer._id.toString(),
            customer.name,
            purchases.length,
            totalSpent,
            purchaseDates
          );
        });
      
        const totalCustomers = await CustomerModel.countDocuments();
      
        const totalPurchases = inventories.reduce((sum, item) => sum + item.quantity, 0);
      
        const totalRevenue = inventories.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
        return new SalesReport(
          customerSummaries,
          totalCustomers,
          totalPurchases,
          totalRevenue,
          startDate,
          endDate
        );
      }


  async generateItemsReport(category?: string): Promise<ItemsReport> {
    const query = category ? { category } : {};
    
    const items = await InventoryModel.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'purchasedBy',
          foreignField: '_id',
          as: 'customers'
        }
      }
    ]);

    const categories = [...new Set(items.map(item => item.category))];
    
    const itemEntries = items.map(item => {
      return new ItemReportEntry(
        item._id.toString(),
        item.itemName,
        item.category,
        item.price,
        item.quantity,
        item.price * item.quantity,
        item.purchasedBy ? item.purchasedBy.length : 0,
        item.createdAt,
      );
    });

    const totalValue = itemEntries.reduce((sum, item) => sum + item.totalValue, 0);

    return new ItemsReport(
      itemEntries,
      itemEntries.length,
      totalValue,
      categories.length
    );
  }

  async getCustomerLedger(startDate: Date, endDate: Date): Promise<CustomerLedger[]> {
    const result = await InventoryModel.aggregate([
      {
        $match: {
          purchasedAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $unwind: '$purchasedBy' },
      {
        $group: {
          _id: '$purchasedBy',
          totalItemsBought: { $sum: 1 },
          totalSpent: { $sum: '$price' },
          lastPurchaseDate: { $max: '$purchasedAt' },
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        $project: {
          customerId: '$_id',
          customerName: '$customer.name',
          email: '$customer.email',
          totalItemsBought: 1,
          totalSpent: 1,
          lastPurchaseDate: 1,
        },
      },
    ]);

    return result as CustomerLedger[];
  }
  
}