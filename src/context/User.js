import React, { useState, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [users, setUsers] = useState([
        { id: 1, name: 'User 1', stream: null },
        { id: 2, name: 'User 2', stream: null }
    ])

    const [isDarkMode, setIsDarkMode] = useState(true)








    return (
        <UserContext.Provider value={{
            users, 
            setUsers,
            isDarkMode,
            setIsDarkMode
              }}>
            {children}
        </UserContext.Provider>
    );
};
