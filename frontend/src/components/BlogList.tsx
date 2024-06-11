import { BlogPreview } from "./BlogPreview"

const BlogList = () => {
  return (
    <div className="flex flex-col mx-auto space-y-4 h-[100vh]">
        <BlogPreview />
        <BlogPreview />
        <BlogPreview />
    </div>
  )
}

export default BlogList