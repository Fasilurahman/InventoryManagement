import { Request, Response, NextFunction } from 'express';
import { InventoryRepository } from '../../infrastructure/database/repositories/InventoryRepository';
import { CreateInventoryItemUseCase  } from '../../application/useCases/Inventory/CreateInventoryItemUseCase';
import { GetAllInventoryItems } from '../../application/useCases/Inventory/GetAllInventoryItems';
import { UpdateInventoryItemUseCase } from '../../application/useCases/Inventory/UpdateInventoryItemUseCase';
import { DeleteInventoryItemUseCase } from '../../application/useCases/Inventory/DeleteInventoryItemUseCase';

export class InventoryController {
    private createInventoryItemUseCase: CreateInventoryItemUseCase
    private getAllInventoryItemsUseCase: GetAllInventoryItems
    private updateInventoryItemUseCase: UpdateInventoryItemUseCase
    private deleteInventoryItemUseCase: DeleteInventoryItemUseCase

    constructor() {
        const inventoryRepository = new InventoryRepository();
        this.createInventoryItemUseCase = new CreateInventoryItemUseCase(inventoryRepository);
        this.getAllInventoryItemsUseCase = new GetAllInventoryItems(inventoryRepository);
        this.updateInventoryItemUseCase = new UpdateInventoryItemUseCase(inventoryRepository);
        this.deleteInventoryItemUseCase = new DeleteInventoryItemUseCase(inventoryRepository);
    }
  
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { itemName, category, price, quantity, description, purchasedBy } = req.body;
        
        const itemData = {
          itemName,
          category,
          price: Number(price),
          quantity: Number(quantity),
          description: description || '',
          purchasedBy: purchasedBy || []
        };
  
        const result = await this.createInventoryItemUseCase.execute(itemData);
        
        res.status(201).json({
          success: true,
          data: result
        });
      } catch (error: any) {
        next(error);
      }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const items = await this.getAllInventoryItemsUseCase.execute();
        res.status(200).json({ data: items });
      } catch (error) {
        next(error);
      }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { itemId } = req.params;
        const itemData = req.body;
        const updated = await this.updateInventoryItemUseCase.execute(itemId, itemData);
        res.status(200).json({updated})
      } catch (error) {
        next(error);
      }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { id } = req.params;  
        const result = await this.deleteInventoryItemUseCase.execute(id);
        res.status(200).json({result})
      } catch (error) {
        next(error);
      }
    }

  }
