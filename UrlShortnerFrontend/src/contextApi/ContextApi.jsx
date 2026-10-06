import { createContext, useContext, useEffect, useState } from "react";
import API from "../Api/Api";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const getToken = localStorage.getItem("token");
    const [token, setToken] = useState(getToken);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            const response = await API.get("/api/auth/me");
            setUser(response.data);
            if (!token) {
                setToken("cookie-session");
            }
        } catch (error) {
            setUser(null);
            if (token === "cookie-session") {
                setToken(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        try {
            await API.post("/api/auth/logout");
        } catch (e) {
            // Log logout attempt error silently
        } finally {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, [token]);

    return (
        <ContextApi.Provider value={{ token, setToken, user, setUser, loading, fetchCurrentUser, logoutUser }}>
            {children}
        </ContextApi.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(ContextApi);
};