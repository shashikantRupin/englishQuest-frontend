import { createContext, useState } from "react";


export const AuthContext = createContext();

const initialData = JSON.parse(localStorage.getItem("user")) || {
    isAuth: false,
    token: "",
    role: [],
    name: ""
}

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(initialData)
    const [refresh, setRefresh] = useState(false)

    const login = (payload) => {
        setUser({ isAuth: true, token: payload.token, name: payload.name, role: payload.role, selectedRole: payload.role[0] })
        localStorage.setItem("user", JSON.stringify({ isAuth: true, token: payload.token, role: payload.role, name: payload.name, selectedRole: payload.role[0] }))
    }
    const logout = () => {
        setUser({ isAuth: false, token: "", role: [], name: "", selectedRole: "" })
        localStorage.setItem("user", JSON.stringify({ isAuth: false, token: "", role: [], name: "", selectedRole: "" }))
    }

    const toggleRole = (role) => {
        setUser({ ...user, selectedRole: role })
        localStorage.setItem("user", JSON.stringify({ ...user, selectedRole: role }))
    }

    return (
        <AuthContext.Provider value={{ login, logout, user, setRefresh, refresh, toggleRole }}>
            {children}
        </AuthContext.Provider>

    )
}
