import { IInventoryRepository } from "../../../domain/interfaces/InventoryRepository";
import { createError } from "../../../infrastructure/middlewares/errorHandler";
import { STATUS_CODES } from "../../../shared/statusCodes";

export class DeleteInventoryItemUseCase {
  constructor(private inventoryRepo: IInventoryRepository) {}

  async execute(id: string): Promise<boolean> {
    try {
      const result = await this.inventoryRepo.deleteInventoryItem(id);
      if (!result) {
        throw createError('Inventory item not found', STATUS_CODES.NOT_FOUND);
      }
      return result;
    } catch (error: any) {
      throw createError(
        error.message || 'Failed to delete inventory item',
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}