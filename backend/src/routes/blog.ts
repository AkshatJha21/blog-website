import { createBlog, deleteBlog, updateBlog } from "@akshatjha21/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string,
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header('Authorization') || "";

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        c.status(403);
        return c.json({
            err: "Bearer token not found"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const user = await verify(token, c.env.JWT_SECRET);

        if (user) {
            //@ts-ignore
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                msg: "You are not logged in"
        })
    }
    } catch (error) {
        c.status(403);
        return c.json({
            err: "Invalid token: " + error  
        });
    }
    
})

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
        
    const payload = await c.req.json();
    const parsedPayload = createBlog.safeParse(payload);

    if (!parsedPayload.success) {
      c.status(411);
      return c.json({
        err: "Incorrect inputs"
      });
    }
    const authorId = c.get("userId");

    try {
        const blog = await prisma.post.create({
            data: {
                title: payload.title,
                content: payload.content,
                authorId: authorId,
                published: true
            }
        });

        return c.json({
            msg: "Blog post created",
            id: blog.id
        });
    } catch (error) {
        c.status(411);
        return c.json({
            err: "Blog post not created"
        });
    }

  })

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const payload = await c.req.json();
    const parsedPayload = updateBlog.safeParse(payload);

    if (!parsedPayload.success) {
      c.status(411);
      return c.json({
        err: "Incorrect inputs"
      });
    }

    try {
        const blog = await prisma.post.update({
            where: {
                id: payload.id
            },
            data: {
                title: payload.title,
                content: payload.content,
                published: true
            }
        });
    
        return c.json({
            msg: "Blog post updated",
            id: blog.id
        });
    } catch (error) {
        c.status(411);
        return c.json({
            err: "Blog post not updated"
        });
    }

    
})

blogRouter.get('/all', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const page = parseInt(c.req.query('page') || '1');
    const limit = 5;
    const skip = (page - 1) * limit;

    try {
        const totalPosts = await prisma.post.count({
            where: {
                published: true
            }
        });

        const totalPages = Math.ceil(totalPosts / limit);
        const blogs = await prisma.post.findMany({
            where: {
                published: true
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: true
            }
        });

        return c.json({
            blogs,
            totalPages
        });
    } catch (error) {
        c.status(500);
        return c.json({
            err: "Error fetching blogs"
        });
    }
})

blogRouter.get('/following', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get("userId");
    const page = parseInt(c.req.query('page') || '1');
    const limit = 5;
    const skip = (page - 1) * limit;

    try {
        
        const follows = await prisma.follow.findMany({
            where: {
                followerId: userId
            },
            select: {
                followingId: true
            }
        });

        const followingIds = follows.map(follow => follow.followingId);

        const totalPosts = await prisma.post.count({
            where: {
                authorId: { in: followingIds },
                published: true
            }
        });

        const totalPages = Math.ceil(totalPosts / limit);

        const blogs = await prisma.post.findMany({
            where: {
                authorId: { in: followingIds },
                published: true
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: true
            }
        });

        return c.json({
            blogs,
            totalPages
        });
    } catch (error) {
        c.status(500);
        return c.json({
            err: "Error fetching blogs from following users"
        });
    }
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = parseInt(c.req.param('id'));

    try {
        const post = await prisma.post.findUnique({
            where: {
                id,
                published: true
            },
            include: {
                author: true
            }
        });
    
        return c.json({
            blog: {
                title: post?.title,
                author: post?.author.name,
                content: post?.content
            }
        });
    } catch (error) {
        c.status(411);
        return c.json({
            err: "Blog post not found"
        });
    }
    
})

blogRouter.delete('/delete', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const payload = await c.req.json();
    const parsedPayload = deleteBlog.safeParse(payload);

    if (!parsedPayload.success) {
      c.status(411);
      return c.json({
        err: "Incorrect inputs"
      });
    }

    const checkId = await prisma.post.findUnique({
        where: {
            id: parseInt(payload.id),
        },
    })

    if (!checkId) {
        c.status(411);
        return c.json({
            msg: "Post not found"
        })
    }

    const post = await prisma.post.delete({
        where: {
            id: parseInt(payload.id)
        }
    });

    return c.json({
        msg: "Blog deleted successfully"
    })
})