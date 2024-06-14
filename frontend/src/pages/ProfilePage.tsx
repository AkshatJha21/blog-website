import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    email: string;
    name: string;
}

const ProfilePage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [focus, setFocus] = useState("Followers");
    const navigate = useNavigate();

    const handleFocusChange = (button: string) => {
        setFocus(button);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        let route = '/followers';

        if (focus === 'Following') {
            route = '/following';
        }

        axios.get(`${BACKEND_URL}/api/v1/user/me${route}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUsers(response.data.users);
        }).catch(err => {
            console.error("Error fetching users: " + err);
        });
    }, [focus]);
  return (
    <div>
        <Navbar 
            primaryBtn="New"
            showPlus={true}
            primaryClick={() => navigate('/create')}
        />
        <div className="flex flex-col mx-auto h-[100vh]">
        <div className="mx-auto gap-x-2 mt-2">
            <button
              onClick={() => handleFocusChange("Followers")} 
              className={`${focus === "Followers" ? "text-black border-b-black" : "text-neutral-400"} bg-transparent font-medium px-4 py-2 border-b border-neutral-300`}
            >
                <p className="text-xl font-semibold">{users.length}</p>
                Followers
            </button>
            <button
              onClick={() => handleFocusChange("Following")} 
              className={`${focus === "Following" ? "text-black border-b-black" : "text-neutral-400"} bg-transparent font-medium px-4 py-2 border-b border-neutral-300`}
            >
                <p className="text-xl font-semibold">{users.length}</p>
                Following
            </button>
        </div>
        {users.map((user) => (
            <div key={user.id} className="mx-auto flex flex-col py-2 px-4 border-b">
                <div className="flex items-center gap-x-2">
                    <div className="flex bg-neutral-200 h-8 w-8 text-sm items-center rounded-full p-2 justify-center">{user.name[0]}</div>
                    <h2 className="font-medium">{user.name}</h2>
                </div>
                <p className="text-neutral-500 font-light">{user.email}</p>
            </div>
        ))}
        </div>
    </div>
  )
}

export default ProfilePage