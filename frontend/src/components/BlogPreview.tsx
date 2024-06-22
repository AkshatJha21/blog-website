import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface BlogPreviewProps {
    inital: string;
    title: string;
    preview: string;
    author: string;
    blogId: number;
}

export const BlogPreview = ({
  inital,
  title,
  preview,
  author,
  blogId
}: BlogPreviewProps) => {
  return (
    <div className="w-[70%] mx-auto p-4 border-b hover:bg-neutral-100 transition">
      <Link to={`/read/${blogId}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 mb-1">
          <div className="p-2 bg-neutral-200 text-sm rounded-full w-8 h-8 flex items-center justify-center">{inital}</div>
          <p className="font-medium">{author}</p>
        </div>
      </div>
      <h2 className="font-bold text-xl my-2">{title}</h2>
      <p className="font-serif">{preview}</p>
      </Link>
    </div>
  )
}