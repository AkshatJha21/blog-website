import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>().basePath('/api/v1');

app.post('/user/signup', async (c) => {
  const payload = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  await prisma.user.create({
    data: {
      email: payload.email,
      name: payload.name,
      password: payload.password
    }
  });

  return c.text('User Signup');
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
