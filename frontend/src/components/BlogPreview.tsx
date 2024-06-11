
interface BlogPreviewProps {
    title: string;
    preview: string;
    author: string;
}

export const BlogPreview = () => {
  return (
    <div className="w-[70%] mx-auto">
      <div className="flex items-center gap-x-2 mb-1">
        <div className="p-2 bg-neutral-200 text-sm rounded-full w-8 h-8 flex items-center justify-center">A</div>
        <p className="font-medium">Writer Name</p>
      </div>
      <h2 className="font-bold text-xl my-2">Title of the blog</h2>
      <p className="font-serif">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi corporis quisquam dolorum repellendus sapiente. Modi necessitatibus omnis et error id. lorem10</p>
    </div>
  )
}