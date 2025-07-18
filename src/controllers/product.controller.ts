import { Request, Response } from "express";
import { Producto } from "../models/productos";

export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await Producto.find({ status: "activo" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

export const createProducto = async (req: Request, res: Response) => {
  try {
    const newProducto = new Producto(req.body);
    await newProducto.save();
    res.status(201).json(newProducto);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el producto", error });
  }
};

export const updateProducto = async (req: Request, res: Response) => {
  try {
    const updated = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el producto" });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const deleted = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        status: "inactivo",
        deleteDate: new Date()
      },
      { new: true }
    );
    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado", producto: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
