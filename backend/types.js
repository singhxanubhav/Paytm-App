import { z } from "zod";

export const userSignup = z.object({
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});

export const userSignin = z.object({
    username: z.string(),
    password: z.string().min(8),
});

export const userUpdate = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().min(8).optional(),
});
