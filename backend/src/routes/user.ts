import { signupInput } from "@akshatjha21/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compare, genSalt, hash } from "bcrypt-ts";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }, 
    Variables: {
      userId: string
    }
}>();

userRouter.use('/me/*', async (c, next) => {
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

userRouter.get('/me', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if(!user) {
      c.status(403);
      return c.json({
        msg: "User not found"
      });
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Error fetching user details: ', error);
    return c.json({
      msg: "Internal Server Error"
    })
  }
});

userRouter.post('/me/follow/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const followUserId = c.req.param('id');

  if (followUserId === userId) {
    c.status(411);
    return c.json({
      err: "Cannot follow yourself"
    });
  }

  try {
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: followUserId
      }
    });

    return c.json({
      msg: "Successfully followed the user"
    });
  } catch (error) {
    console.error('Error following the user: ', error);
    c.status(411);
    return c.json({
      err: "Error following user"
    });
  }
});

userRouter.get('/me/followers', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");

  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId
      },
      include: {
        follower: true
      }
    });

    return c.json({
      users: followers.map(follow => ({
        id: follow.follower.id,
        email: follow.follower.email,
        name: follow.follower.name
      }))
    });
  } catch (error) {
    console.error('Error getting followers: ', error);
    c.status(411);
    return c.json({
      err: "Error finding followers"
    });
  }
});

userRouter.get('/me/following', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");

  try {
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId
      },
      include: {
        following: true
      }
    });

    return c.json({
      users: following.map(follow => ({
        id: follow.following.id,
        email: follow.following.email,
        name: follow.following.name
      }))
    });
  } catch (error) {
    console.error('Error getting following: ', error);
    c.status(411);
    return c.json({
      err: "Error finding following"
    });
  }
});

userRouter.delete('/me/unfollow/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');
  const unfollowUserId = c.req.param('id');

  try {
    await prisma.follow.deleteMany({
      where: {
        followerId: userId,
        followingId: unfollowUserId
      }
    });

    return c.json({
      msg: "Successfully unfollowed the user"
    });
  } catch (error) {
    console.error("Error unfollowing the user: " + error);
    c.status(411);
    return c.json({
      err: "Error unfollowing user"
    });
  }
});

userRouter.delete('/me/remove-follower/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');
  const followerUserId = c.req.param('id');

  try {
    await prisma.follow.deleteMany({
      where: {
        followerId: followerUserId,
        followingId: userId
      }
    });

    return c.json({
      msg: "Successfully removed the follower"
    });
  } catch (error) {
    console.error("Error removing follower: " + error);
    c.status(411);
    return c.json({
      err: "Error removing follower"
    });
  }
});

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