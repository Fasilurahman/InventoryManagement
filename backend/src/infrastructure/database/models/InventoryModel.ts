import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    purchasedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', 
      },
    ],
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const InventoryModel = mongoose.model('Inventory', inventorySchema);
