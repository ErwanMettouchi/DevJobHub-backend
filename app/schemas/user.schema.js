import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "Le prénom est requis" })
    .max(30, { message: "Le prénom ne peut pas dépasser 30 caractères" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Le nom est requis" })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" }),
  email: z.email({ message: "L'adresse mail est invalide" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit faire au moins 8 caractères" })
    .regex(/[a-z]/, { message: "Une lettre minuscule requise" })
    .regex(/[A-Z]/, { message: "Une lettre majuscule requise" })
    .regex(/[0-9]/, { message: "Un chiffre requis" })
    .regex(/[^a-zA-Z0-9]/, { message: "Un caractère spécial requis" }),
});
