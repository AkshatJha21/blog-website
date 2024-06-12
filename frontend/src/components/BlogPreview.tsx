
interface BlogPreviewProps {
    inital: string;
    title: string;
    preview: string;
    author: string;
}

export const BlogPreview = ({
  inital,
  title,
  preview,
  author
}: BlogPreviewProps) => {
  return (
    <div className="w-[70%] mx-auto hover:bg-neutral-100 p-4 border-b hover:cursor-pointer">
      <div className="flex items-center gap-x-2 mb-1">
        <div className="p-2 bg-neutral-200 text-sm rounded-full w-8 h-8 flex items-center justify-center">{inital}</div>
        <p className="font-medium">{author}</p>
      </div>
      <h2 className="font-bold text-xl my-2">{title}</h2>
      <p className="font-serif">{preview}</p>
    </div>
  )
}