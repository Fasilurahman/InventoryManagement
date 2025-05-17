export class InventoryItem {
    constructor(
      public id: string,
      public itemName: string,
      public category: string,
      public price: number,
      public quantity: number,
      public description: string,
      public purchasedBy: string[],
      public createdAt?: Date,
      public updatedAt?: Date
    ) {}
}