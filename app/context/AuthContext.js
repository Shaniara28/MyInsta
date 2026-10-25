
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getToken() {
            try {
                const savedToken = await SecureStore.getItemAsync("token");
                setToken(savedToken);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        getToken();
    }, []);

    async function signIn(accessToken) {
        await SecureStore.setItemAsync("token", accessToken);
        setToken(accessToken);
    }

    async function signOut() {
        await SecureStore.deleteItemAsync("token");
        setToken(null);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                isSignedIn: Boolean(token),
                isLoading,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
