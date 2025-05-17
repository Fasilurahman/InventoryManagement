export class SalesReport {
    constructor(
      public customers: CustomerSalesSummary[],
      public totalCustomers: number,
      public totalPurchases: number,
      public totalRevenue: number,
      public startDate: Date,
      public endDate: Date
    ) {}
  }
  
  export class CustomerSalesSummary {
    constructor(
      public customerId: string,
      public customerName: string,
      public itemsPurchased: number,
      public totalSpent: number,
      public purchaseDates: Date[]
    ) {}
  }
  
  export class ItemsReport {
    constructor(
      public items: ItemReportEntry[],
      public totalItems: number,
      public totalValue: number,
      public totalCategories: number
    ) {}
  }
  
  export class ItemReportEntry {
    constructor(
      public id: string,
      public name: string,
      public category: string,
      public price: number,
      public quantity: number,
      public totalValue: number,
      public purchasedByCount: number,
      public createdAt: Date
    ) {}
  }
  
  export class CustomerLedger {
    constructor(
      public customerId: string,
      public customerName: string,
      public email: string,
      // public totalOrders: number,
      public totalItemsBought: number,
      public totalSpent: number,
      public lastPurchaseDate: Date
    ) {}
  }
  
  export class CustomerTransaction {
    constructor(
      public itemId: string,
      public itemName: string,
      public price: number,
      public purchaseDate: Date | null
    ) {}
  }