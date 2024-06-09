import { Hono } from "hono";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*', async (c, next) => {
    await next();
})

blogRouter.post('/blog', (c) => {
    console.log(c.get('userId'));
    return c.text('Publish blog')
  })

blogRouter.put('/', (c) => {
  return c.text('Edit blog')
})

blogRouter.get('/:id', (c) => {
  const id = c.req.param('id');
  console.log(id);
  return c.text('Get blog')
})

blogRouter.get('/bulk', (c) => {
  return c.text('Get all blogs')
})