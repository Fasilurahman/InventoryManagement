// src/infrastructure/repositories/InventoryRepository.ts
import { IInventoryRepository } from "../../../domain/interfaces/InventoryRepository";
import { InventoryItem } from "../../../domain/entities/InventoryItem";
import { InventoryModel } from "../models/InventoryModel";
import { Types } from "mongoose";

export class InventoryRepository implements IInventoryRepository {
    async create(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
        const newItem = await InventoryModel.create(item);
        return this.mapToEntity(newItem);
      }

    async getAllInventory(): Promise<InventoryItem[]> {
        const items = await InventoryModel.find().populate('purchasedBy');
        return items.map((item: any)=> new InventoryItem(
          item._id.toString(),
          item.itemName,
          item.category,
          item.price,
          item.quantity,
          item.description || '',
          item.purchasedBy?.map((id: any) => id.toString()) || []
        ))
    }

    async findById(id: string): Promise<InventoryItem | null> {
      const results = await InventoryModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(id) }
        },
        {
          $lookup: {
            from: "users", // your user collection name in MongoDB (usually lowercase plural)
            localField: "purchasedBy",
            foreignField: "_id",
            as: "purchasedBy"
          }
        }
      ]);
    
      const item = results[0];
      if (!item) return null;
    
      return this.mapToEntity(item);
    }
    

    async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
      const updated = await InventoryModel.findByIdAndUpdate(id, data, { new: true }).populate("purchasedBy");
      if (!updated) throw new Error("Item not found or update failed");
      return this.mapToEntity(updated);
    }

    async deleteInventoryItem(id: string): Promise<boolean> {
      const result = await InventoryModel.findByIdAndDelete(id);
      return result !== null; 
    }

      private mapToEntity(document: any): InventoryItem {
        return new InventoryItem(
          document._id.toString(),
          document.itemName,
          document.category,
          document.price,
          document.quantity,
          document.description || '',
          document.purchasedBy?.map((id: any) => id) || []
        );
    }
}