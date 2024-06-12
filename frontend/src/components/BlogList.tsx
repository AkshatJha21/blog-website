import { BlogPreview } from "./BlogPreview"

const BlogList = () => {
  return (
    <div className="flex flex-col mx-auto space-y-4 h-[100vh]">
        <div className="mx-auto gap-x-2 mt-2">
            <button className="bg-transparent font-medium text-neutral-400 focus:text-black px-4 py-2 focus:border-b-black border-b border-neutral-300">All Posts</button>
            <button className="bg-transparent font-medium text-neutral-400 focus:text-black px-4 py-2 focus:border-b-black border-b border-neutral-300">Following</button>
        </div>
        <BlogPreview />
        <BlogPreview />
        <BlogPreview />
    </div>
  )
}

// UPDATES REQUIRED:
// DONE -> 1. published / drafts (based on published true or false render accordingly no special changes required)
// DONE -> 2. following / followers (might need to make 1 or 2 new models in prisma)
// DONE -> 3. Add dropdown menu in navbar -> new post, published posts, drafts, logout
// DONE -> 4. Pagination(5 posts at a time)
// DONE -> 5. date of creation (sort: latest post first)
// DONE -> 6. change post id to number from string

export default BlogList