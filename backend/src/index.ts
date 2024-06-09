import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>().basePath('/api/v1');

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

    const token = sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token
    });
  } catch (error) {
    c.status(403);
    return c.json({
      err: "Error while signing up"
    });
  }
})

app.post('/user/signin', (c) => {
  return c.text('User Signin')
})

app.post('/blog', (c) => {
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
