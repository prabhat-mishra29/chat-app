import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();


    const getUserOnLoad = async () => {
        try {
            //Get the currently logged in user.[currently-session]
            let accountDetails = await account.get();
            console.log("accountdetails : ",accountDetails);
            setUser(accountDetails);
        } catch (error) {}
        setLoading(false);
    };


    const handleUserLogin = async (e, credentials) => {
        e.preventDefault();
        console.log("CREDS:", credentials);

        try {
            let response = await account.createEmailPasswordSession(
                credentials.email,
                credentials.password
            );

            let accountDetails = await account.get();
            setUser(accountDetails);
            navigate("/");

        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };


    const handleLogout = async () => {
        const response = await account.deleteSession("current");
        setUser(null);
    };


    const handleRegister = async (e, credentials) => {
        e.preventDefault();
        console.log("Handle Register triggered!", credentials);

        if (credentials.password1 !== credentials.password2) {
            alert("Passwords did not match!");
            return;
        }

        try {
            let response = await account.create(
                ID.unique(),
                credentials.email,
                credentials.password1,
                credentials.name
            );
            console.log("User registered!", response);

            await account.createEmailPasswordSession(
                credentials.email,
                credentials.password1
            );

            let accountDetails = await account.get();
            setUser(accountDetails);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        getUserOnLoad();
    }, []);


    const contextData = {
        user,
        handleUserLogin,
        handleLogout,
        handleRegister,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <div className="loading"><div className="spinner"></div></div> : children}
        </AuthContext.Provider>
    );
};

//custom hook:-
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;