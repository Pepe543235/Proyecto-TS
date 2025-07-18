import { Request, Response, NextFunction } from "express"; 
import { generateAccessToken, verifyAccessToken } from "../utils/generateToken"; 
import cache from "../utils/cache";
import dayjs from "dayjs";
import { User } from "../models/user";
import bcrypt from "bcrypt";

declare module 'express' {
    interface Request {
        userId?: string,
        roles?: string;
    }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('roles');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Arreglamos aquí el error de roles undefined
    const roleStrings = Array.isArray(user.roles)
      ? user.roles
          .filter((role: any) => role)
          .map((role: any) =>
            typeof role === 'object' && role._id ? role._id.toString() : role.toString()
          )
      : [];

    const token = generateAccessToken(user._id.toString(), roleStrings);

    res.json({ token });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ message: "Token requerido" });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
        return res.status(403).json({ message: "Token invalido o expirado" });
    }

    req.userId = decoded.userId; 
    next();
};

export const getTimeToken = (req: Request, res: Response) => { 
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "User ID no se encuentra en este token" });
    }

    const ttl = cache.getTtl(userId);

    if (!ttl){
        return res.status(404).json({ message: "Token no existe o ha expirado en cache" });
    }

    const now = Date.now();
    const timeToLive = Math.floor((ttl - now) / 1000);
    const expTime = dayjs(ttl).format('HH:mm:ss');

    return res.json({
        timeToLive,
        expTime
    });
}

export const updateToken = (req:Request,res:Response) => {
    const { userId } = req.params;

    const ttl = cache.getTtl(userId);

    if (!ttl){
        return res.status(404).json({ message: "Token no existe"});
    }
    const newTimeTtl:number = 60 * 15;
    cache.ttl(userId, newTimeTtl);

    return res.json({ message:"Actualizacion con exito" });
}

export const getAllUsers = async (req: Request, res: Response) => {
    const { userEmail } = req.query;
    const userList = await User.find();
    const userByEmail = await User.find({ email: userEmail });

    console.log(userByEmail);
    return res.json({ userList });
}

export const saveUsers = async (req: Request, res: Response) => {
    try {
        const { name, email, password, roles, phone } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            roles,
            phone,
            createDate: Date.now(),
            status: true
        });

        const user = await newUser.save();

        return res.json({ user });
    } catch (error) {
        console.log("Error en saveUser: ", error);
        return res.status(500).json({ error: "Error al guardar usuario" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { password, role, name, phone, email } = req.body;

        const updateData: any = { role, name, phone, email };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.json({ user: updatedUser });
    } catch (error) {
        console.log("Error en updateUser: ", error);
        return res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndUpdate(
            id,
            {
                status: false,
                deleteDate: new Date()
            },
            { new: true }
        );

        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json({ message: 'Usuario desactivado', deletedUser });

    } catch (error) {
        console.log("Error en deleteUser: ", error);
        return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

export const updateModal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando usuario' });
  }
};
