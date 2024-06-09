import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string
  }
}>().basePath('/api/v1');

app.use('/blog/*', async (c, next) => {
  const jwt = await c.req.header("Authorization");

  if (!jwt) {
    c.status(401);
    return c.json({
      err: "Unauthorized"
    });
  }

  const token = jwt.split(' ')[1];

  const payload = await verify(token, c.env.JWT_SECRET);

  if (!payload) {
    c.status(401);
    return c.json({
      err: "Unauthorized"
    });
  }

  c.set('userId', payload.id);  
  await next();
});

app.post('/user/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const payload = await c.req.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        password: payload.password
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

app.post('/user/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const payload = await c.req.json();

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

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({
    msg: "User sign in successful",
    jwt: token
  });
})

app.post('/blog', (c) => {
  console.log(c.get('userId'));
  return c.text('Publish blog')
})

app.put('/blog', (c) => {
  return c.text('Edit blog')
})

app.get('/blog/:id', (c) => {
  const id = c.req.param('id');
  console.log(id);
  return c.text('Get blog')
})

app.get('/blog/bulk', (c) => {
  return c.text('Get all blogs')
})

export default app
