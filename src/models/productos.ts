import { Document, model, Schema, Types } from "mongoose";

export interface IProducto extends Document {
  id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  createDate: Date;
  deleteDate?: Date | null;
}

const ProductoSchema = new Schema<IProducto>({
  id: { type: Schema.Types.ObjectId, required: true, auto: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  createDate: { type: Date, default: Date.now },
  deleteDate: { type: Date, default: null }
});

export const Producto = model<IProducto>("Producto", ProductoSchema, "productos");
