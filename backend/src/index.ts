import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono()

app.post('/api/v1/user/signup', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate())
  return c.text('User Signup')
})

app.post('/api/v1/user/signin', (c) => {
  return c.text('User Signin')
})

app.post('/api/v1/blog', (c) => {
  return c.text('Publish blog')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Edit blog')
})

app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id');
  console.log(id);
  return c.text('Get blog')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Get all blogs')
})

export default app
