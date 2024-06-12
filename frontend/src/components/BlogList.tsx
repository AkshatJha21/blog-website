import { useEffect, useState } from "react"
import { BlogPreview } from "./BlogPreview"
import axios from "axios";
import { BACKEND_URL } from "../config";

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${BACKEND_URL}/api/v1/blog/all?page=1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      setBlogs(response.data.blogs);
    }).catch(error => {
      console.error('Error fetching blogs: ', error);
    })
  }, []);

  return (
    <div className="flex flex-col mx-auto h-[100vh]">
        <div className="mx-auto gap-x-2 mt-2">
            <button className="bg-transparent font-medium text-neutral-400 focus:text-black px-4 py-2 focus:border-b-black border-b border-neutral-300">All Posts</button>
            <button className="bg-transparent font-medium text-neutral-400 focus:text-black px-4 py-2 focus:border-b-black border-b border-neutral-300">Following</button>
        </div>
        {blogs.map((blog) => {
          return (
            <BlogPreview inital={blog.author.name[0]} title={blog.title} author={blog.author.name} preview={blog.content}/>
          )
        })}
    </div>
  )
}

export default BlogList