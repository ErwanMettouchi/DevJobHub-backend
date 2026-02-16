import bcrypt from "bcrypt";
import { User } from "../models/associations.js";
import { userSchema } from "../schemas/user.schema.js";
import { generateToken } from "../helpers/jwt.js";
import { ConflictError } from "../errors/conflict-error.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";

export const userController = {
  signup: async (req, res, next) => {
    const { firstName, lastName, email, password } = userSchema.parse(req.body);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ConflictError("Un compte avec cet email existe déjà"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateToken({ id: user.id }, "24h");

    res.status(201).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new UnauthorizedError("Email et mot de passe requis"));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new UnauthorizedError("Email ou mot de passe incorrect"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new UnauthorizedError("Email ou mot de passe incorrect"));
    }

    const token = generateToken({ id: user.id }, "24h");

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  },
};
