import { useEffect, useState } from "react"
import { BlogPreview } from "./BlogPreview"
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Author {
  id: string;
  name: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  author: Author
}

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handlePrevious = () => {
      setPage(page => page - 1);
  }

  const handleNext = () => {
      setPage(page => page + 1);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${BACKEND_URL}/api/v1/blog/all?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      setBlogs(response.data.blogs);
      setTotal(response.data.totalPages);
    }).catch(error => {
      console.error('Error fetching blogs: ', error);
    })
  }, [page]);

  return (
    <div className="flex flex-col mx-auto h-[100vh]">
        <div className="mx-auto gap-x-2 mt-2">
            <button className="bg-transparent font-medium text-neutral-400 focus:text-black px-4 py-2 focus:border-b-black border-b border-neutral-300">All Posts</button>
            <button className="bg-transparent font-medium text-neutral-400 focus:text-black px-4 py-2 focus:border-b-black border-b border-neutral-300">Following</button>
        </div>
        {blogs.map((blog) => {
          return (
            <BlogPreview key={blog.id} inital={blog.author.name[0]} title={blog.title} author={blog.author.name} preview={blog.content}/>
          )
        })}
        <div className="flex mx-auto gap-x-2">
          <button className="p-2 border disabled:text-neutral-200" disabled={page === 1} onClick={handlePrevious}>Previous</button>
          <button className="p-2 border disabled:text-neutral-200" disabled={page === total} onClick={handleNext}>Next</button>
        </div>
    </div>
  )
}

export default BlogList