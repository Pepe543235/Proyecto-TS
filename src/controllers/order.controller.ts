import { Request, Response } from 'express';
import { Order } from '../models/ordenes';
import mongoose from 'mongoose';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    return res.status(201).json(order);
  } catch (error) {
    console.log("Error en createOrder: ", error);
    return res.status(500).json({ error: 'Error al crear la orden' });
  }
};

export const payOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status: 'Pagado', updateDate: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    return res.json(updated);
  } catch (error) {
    console.log("Error en payOrder: ", error);
    return res.status(500).json({ error: 'Error al actualizar la orden' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status: 'Cancelado', updateDate: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    return res.json(updated);
  } catch (error) {
    console.log("Error en cancelOrder: ", error);
    return res.status(500).json({ error: 'Error al cancelar la orden' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('products.productId', 'name price stock');

    return res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error en getOrders:', error.message);
    return res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de orden no válido' });
  }

  try {
    const updateFields = {
      ...req.body,
      updateDate: new Date()
    };

    const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, {
      new: true
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    console.error('Error al actualizar la orden:', error.message);
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
};