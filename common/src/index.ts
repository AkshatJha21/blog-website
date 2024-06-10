import z from "zod";

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
});

export const loginInput = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export const createBlog = z.object({
    title: z.string(),
    content: z.string()
});

export const updateBlog = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string()
});

export const deleteBlog = z.object({
    id: z.string()
});

export type SignupInput = z.infer<typeof signupInput>;
export type LoginInput = z.infer<typeof loginInput>;
export type BlogCreate = z.infer<typeof createBlog>;
export type BlogDelete = z.infer<typeof deleteBlog>;
export type BlogUpdate = z.infer<typeof updateBlog>;