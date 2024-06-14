import axios from "axios";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";


interface User {
    id: string;
    name: string;
    email: string;
}

interface UserContextType {
    user: User;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({ name: "", id: "", email: ""});

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.get(`${BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                setUser(response.data.user);
            }).catch(error => {
                console.error("Error fetching user: " + error);
            })
        }
    }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used inside UserProvider");
    }
    return context;
}