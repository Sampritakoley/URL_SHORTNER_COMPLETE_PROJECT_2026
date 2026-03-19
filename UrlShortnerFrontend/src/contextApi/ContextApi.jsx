import { createContext, useContext, useState } from "react";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {

    const getToken = localStorage.getItem("token");
    const [token, setToken] = useState(getToken);

    return (
        <ContextApi.Provider value={{ token, setToken }}>
            {children}
        </ContextApi.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(ContextApi);
};