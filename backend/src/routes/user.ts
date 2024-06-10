import { signupInput } from "@akshatjha21/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compare, genSalt, hash } from "bcrypt-ts";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const payload = await c.req.json();
    const parsedPayload = signupInput.safeParse(payload);

    if (!parsedPayload.success) {
      c.status(411);
      return c.json({
        err: "Incorrect inputs"
      });
    }
  
    const existingUser = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    });
  
    if (existingUser) {
      c.status(403);
      return c.json({
        err: "User already exists"
      });
    }
  
    try {
      const salt = await genSalt(10);
      const hashedPassword = await hash(payload.password, salt);
  
      const user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          password: hashedPassword
        }
      });
  
      const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  
      return c.json({
        msg: "User signup successful",
        jwt: token
      });
    } catch (error) {
      c.status(403);
      return c.json({
        err: "Error while signing up"
      });
    }
  })
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const payload = await c.req.json();
    const parsedPayload = signupInput.safeParse(payload);

    if (!parsedPayload.success) {
      c.status(411);
      return c.json({
        err: "Incorrect inputs"
      });
    }
  
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    });
    
    if (!user) {
      c.status(403);
      return c.json({
        err: "User not found"
      });
    }
  
    const validPassword = await compare(payload.password, user.password);
  
    if (!validPassword) {
      c.status(403);
      return c.json({
        err: "Incorrect password"
      }); 
    } else {
      const token = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({
        msg: "User sign in successful",
        jwt: token
      });
    }
  })