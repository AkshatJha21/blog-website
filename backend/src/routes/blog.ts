import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

type Variables = {
    userId: string
}

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: Variables
}>();

blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header('Authorization') || "";

    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user) {
        c.set("userId", user.id);
        await next();
    } else {
        c.status(403);
        return c.json({
            msg: "You are not logged in"
        })
    }
})

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
        
    const payload = await c.req.json();
    const authorId = c.get("userId");

    const blog = await prisma.post.create({
        data: {
            title: payload.title,
            content: payload.content,
            authorId: authorId
        }
    });

    return c.json({
        id: blog.id
    });
  })

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const payload = await c.req.json();

    const blog = await prisma.post.update({
        where: {
            id: payload.id
        },
        data: {
            title: payload.title,
            content: payload.content
        }
    });

    return c.json({
        id: blog.id
    });
})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany();

    return c.json({
        blog: blogs
    });
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = await c.req.param('id');

    const post = await prisma.post.findUnique({
        where: {
            id
        }
    });

    return c.json({
        post
    });
})