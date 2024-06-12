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
  const [focus, setFocus] = useState("All");

  const handlePrevious = () => {
      setPage(page => page - 1);
  }

  const handleNext = () => {
      setPage(page => page + 1);
  }

  const handleFocusChange = (button: string) => {
    setFocus(button);
    setPage(1);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    let route = "/api/v1/blog/all";

    if (focus === "Following") {
      route = "/api/v1/blog/following";
    }

    axios.get(`${BACKEND_URL}${route}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      setBlogs(response.data.blogs);
      setTotal(response.data.totalPages);
    }).catch(error => {
      console.error('Error fetching blogs: ', error);
    })
  }, [page, focus]);

  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  return (
    <div className="flex flex-col mx-auto h-[100vh]">
        <div className="mx-auto gap-x-2 mt-2">
            <button
              onClick={() => handleFocusChange("All")} 
              className={`${focus === "All" ? "text-black border-b-black" : "text-neutral-400"} bg-transparent font-medium px-4 py-2 border-b border-neutral-300`}
            >
              All Posts
            </button>
            <button
              onClick={() => handleFocusChange("Following")} 
              className={`${focus === "Following" ? "text-black border-b-black" : "text-neutral-400"} bg-transparent font-medium px-4 py-2 border-b border-neutral-300`}
            >
              Following
            </button>
        </div>
        {blogs.map((blog) => {
          return (
            <BlogPreview key={blog.id} inital={blog.author.name[0]} title={blog.title} author={blog.author.name} preview={truncateString(blog.content, 150)}/>
          )
        })}
        <div className="flex mx-auto mt-2 text-sm border-2 rounded-sm fixed bottom-2 right-2 bg-white">
          <button 
            className="p-2 disabled:text-neutral-300 flex items-center border-r" 
            disabled={page === 1} 
            onClick={handlePrevious}
          >
            <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14 8-4 4 4 4"/>
            </svg>
          </button>
          <button 
          className="p-2 disabled:text-neutral-300 flex items-center border-r" 
          disabled={page === total} 
          onClick={handleNext}
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 16 4-4-4-4"/>
            </svg>
          </button>
        </div>
    </div>
  )
}

export default BlogList