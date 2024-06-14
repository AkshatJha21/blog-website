import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"

interface User {
    email: string;
    name: string;
}

const ProfilePage = () => {
    const [users, setUsers] = useState();

    useEffect(() => {

    }, []);
  return (
    <div>
        <Navbar 
            primaryBtn="New"
            showPlus={true}
            primaryClick={() => {}}
        />
        <div className="flex flex-col mx-auto h-[100vh]">
        <div className="mx-auto gap-x-2 mt-2">
            <button
              onClick={() => handleFocusChange("All")} 
              className={`${focus === "All" ? "text-black border-b-black" : "text-neutral-400"} bg-transparent font-medium px-4 py-2 border-b border-neutral-300`}
            >
                <p className="text-xl font-semibold">12</p>
                Followers
            </button>
            <button
              onClick={() => handleFocusChange("Following")} 
              className={`${focus === "Following" ? "text-black border-b-black" : "text-neutral-400"} bg-transparent font-medium px-4 py-2 border-b border-neutral-300`}
            >
                <p className="text-xl font-semibold">10</p>
                Following
            </button>
        </div>
        <div className="mx-auto flex flex-col py-2 px-4 border-b">
            <div className="flex items-center gap-x-2">
                <div className="flex bg-neutral-200 h-8 w-8 text-sm items-center rounded-full p-2 justify-center">U</div>
                <h2 className="font-medium">User Name</h2>
            </div>
            <p className="text-neutral-500 font-light">useremail@email.com</p>
        </div>
        </div>
    </div>
  )
}

export default ProfilePage