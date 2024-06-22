import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import NoResult from "../components/NoResult";

interface User {
    id: string;
    email: string;
    name: string;
}

const ProfilePage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [focus, setFocus] = useState("Followers");
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const navigate = useNavigate();

    const handleFocusChange = (button: string) => {
        setFocus(button);
    };

    const fetchCounts = async (token: string | null) => {
        try {
            const followerResponse = await axios.get(`${BACKEND_URL}/api/v1/user/me/followers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFollowers(followerResponse.data.users.length);

            const followingResponse = await axios.get(`${BACKEND_URL}/api/v1/user/me/following`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFollowing(followingResponse.data.users.length);
        } catch (error) {
            console.error('Error fetching followers/following count: ' + error);
        }
    }

    const fetchUsers = async (token: string | null, route: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/user/me${route}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users: ' + error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchCounts(token);

        const route = focus === 'Following' ? '/following' : '/followers';
        fetchUsers(token, route);
    }, [focus]);

    const handleButtonClick = async (userId: string) => {
        const token = localStorage.getItem('token');
        try {
            if (focus === 'Following') {
                await axios.delete(`${BACKEND_URL}/api/v1/user/me/unfollow/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.delete(`${BACKEND_URL}/api/v1/user/me/remove-follower/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            fetchUsers(token, focus === 'Following' ? '/following' : '/followers');
            fetchCounts(token);
        } catch (error) {
            console.error(`Error ${focus === 'Following' ? 'unfollowing' : 'removing follower'}: ` + error);
        }
    };

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
                <p className="text-xl font-semibold">{followers}</p>
                Followers
            </button>
            <button
              onClick={() => handleFocusChange("Following")} 
              className={`${focus === "Following" ? "text-black border-b-black" : "text-neutral-400"} bg-transparent font-medium px-4 py-2 border-b border-neutral-300`}
            >
                <p className="text-xl font-semibold">{following}</p>
                Following
            </button>
        </div>
        {loading ? (
            <Loader />
        ) : users.length === 0 ? (
            <NoResult />
        ) : (
            users.map((user) => {
                return (
                    <div key={user.id} className="w-[70%] lg:w-[40%] mx-auto justify-between flex py-2 px-4 border-b">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <div className="flex bg-neutral-200 h-8 w-8 text-sm items-center rounded-full p-2 justify-center">{user.name[0]}</div>
                                <h2 className="font-medium">{user.name}</h2>
                            </div>
                            <p className="text-neutral-500 font-light">{user.email}</p>
                        </div>
                        <button onClick={() => handleButtonClick(user.id)} className="bg-black text-white h-8 p-2 flex items-center rounded-sm text-sm font-medium hover:opacity-75 transition my-auto">{focus === 'Following' ? 'Unfollow' : 'Remove'}</button>
                    </div>
                )
            })
        )}
        </div>
    </div>
  )
}

export default ProfilePage