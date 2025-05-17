import { InventoryItem } from "../../../domain/entities/InventoryItem";
import { IInventoryRepository } from "../../../domain/interfaces/InventoryRepository";
import { createError } from "../../../infrastructure/middlewares/errorHandler";
import { STATUS_CODES } from "../../../shared/statusCodes";

export class CreateInventoryItemUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    try {
      if (!itemData.itemName || !itemData.category) {
        throw createError('Item name and category are required', STATUS_CODES.BAD_REQUEST);
      }
      if (itemData.price < 0) {
        throw createError('Price cannot be negative', STATUS_CODES.BAD_REQUEST);
      }
      if (itemData.quantity < 0) {
        throw createError('Quantity cannot be negative', STATUS_CODES.BAD_REQUEST);
      }
      return await this.inventoryRepository.create(itemData);
    } catch (error: any) {
      throw createError(
        error.message || 'Failed to create inventory item',
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}