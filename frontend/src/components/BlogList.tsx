import { BlogPreview } from "./BlogPreview"

const BlogList = () => {
  return (
    <div className="flex flex-col mx-auto space-y-4 h-[100vh]">
        <div className="mx-auto gap-x-2 mt-2">
            <button className="bg-transparent px-4 py-2 focus:border-b-black border-b border-neutral-300">All Posts</button>
            <button className="bg-transparent px-4 py-2 focus:border-b-black border-b border-neutral-300">Your Posts</button>
        </div>
        <BlogPreview />
        <BlogPreview />
        <BlogPreview />
    </div>
  )
}

// UPDATES REQUIRED:
// 1. published / drafts (based on published true or false render accordingly no special changes required)
// 2. following / followers (might need to make 1 or 2 new models in prisma)
// 3. Add dropdown menu in navbar -> new post, published posts, drafts, logout
// 4. Pagination(5 posts at a time)
// 

export default BlogList