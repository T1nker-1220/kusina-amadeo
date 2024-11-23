import * as mongoose from 'mongoose';

interface IAddon {
  name: string;
  price: number;
}

interface IProduct {
  name: string;
  description: string;
  price: number;
  category: 'Budget Meals' | 'Silog Meals' | 'Ala Carte' | 'Beverages';
  image?: string;
  productId: string;
  addons?: IAddon[];
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages'],
  },
  image: {
    type: String,
    required: false,
  },
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  addons: [{
    name: String,
    price: Number,
  }],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
export default Product;
