import { Request, Response } from 'express';
import { Order } from '../models/ordenes';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);

    return res.json({ message: 'Orden creada' });

    } catch (error) {
        console.log("Error en payOrder: ", error);
        return res.status(404).json({ error: 'Orden no encontrada' });
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
    
    res.json(updated);

    return res.json({ message: 'Orden pagada' });
    
    } catch (error) {
        console.log("Error en payOrder: ", error);
        return res.status(404).json({ error: 'Orden no encontrada' });
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

    res.json(updated);

    return res.json({ message: 'Orden cancelada' });

    } catch (error) {
        console.log("Error en cancelOrder: ", error);
        return res.status(404).json({ error: 'Orden no encontrada' });
    }
};
