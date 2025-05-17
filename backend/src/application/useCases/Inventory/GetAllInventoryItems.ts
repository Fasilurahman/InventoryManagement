import { IInventoryRepository } from "../../../domain/interfaces/InventoryRepository";
import { InventoryItem } from "../../../domain/entities/InventoryItem";
import { createError } from "../../../infrastructure/middlewares/errorHandler";
import { STATUS_CODES } from "../../../shared/statusCodes";

export class GetAllInventoryItems {
  constructor(private inventoryRepo: IInventoryRepository) {}

  async execute(): Promise<InventoryItem[]> {
    try {
      return await this.inventoryRepo.getAllInventory();
    } catch (error: any) {
      throw createError(
        error.message || 'Failed to fetch inventory items',
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}