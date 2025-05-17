import { IInventoryRepository } from "../../../domain/interfaces/InventoryRepository";
import { InventoryItem } from "../../../domain/entities/InventoryItem";
import { createError } from "../../../infrastructure/middlewares/errorHandler";
import { STATUS_CODES } from "../../../shared/statusCodes";

export class UpdateInventoryItemUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(id: string, data: Partial<InventoryItem>) {
    try {
      const existing = await this.inventoryRepository.findById(id);
      if (!existing) {
        throw createError('Item not found', STATUS_CODES.NOT_FOUND);
      }

      if (data.price !== undefined && data.price < 0) {
        throw createError('Price cannot be negative', STATUS_CODES.BAD_REQUEST);
      }

      if (data.quantity !== undefined && data.quantity < 0) {
        throw createError('Quantity cannot be negative', STATUS_CODES.BAD_REQUEST);
      }

      return await this.inventoryRepository.update(id, data);
    } catch (error: any) {
      throw createError(
        error.message || 'Failed to update inventory item',
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}