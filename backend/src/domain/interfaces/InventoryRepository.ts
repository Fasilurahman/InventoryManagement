import { InventoryItem } from '../entities/InventoryItem';

export interface IInventoryRepository {
    create(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem>;
    getAllInventory(): Promise<InventoryItem[]>;
    findById(id: string): Promise<InventoryItem | null>;
    update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem>;
    deleteInventoryItem(id: string): Promise<boolean>;
}
