import { AuthContextType, UserType } from "@/types";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "@/config/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

// Crear contexto
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType>(null);
    const router = useRouter();

    // Escuchar cambios de autenticación y cargar datos del usuario
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                updateUserData(firebaseUser.uid); 
                router.replace("/(tabs)"); // Redirigir a la pantalla de inicio
            } else {
                setUser(null); // Usuario no autenticado
                router.replace("/(auth)/welcome"); // Redirigir a la pantalla de bienvenida
            }
        });

        return () => unsubscribe(); // Limpieza del listener
    }, []);

    // Iniciar sesión
    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: any) {
            return { success: false, msg: error.message };
        }
    };

    // Registrar usuario y guardar datos personalizados en Firestore
    const register = async (
        email: string,
        password: string,
        name: string,
        height: number,
        weight: number,
        age: number,
        gender: string,
        activity: string
    ) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, "users", response.user.uid), {
                uid: response.user.uid,
                email,
                name,
                height,
                weight,
                age,
                gender,
                activity,
            });
            return { success: true };
        } catch (error: any) {
            return { success: false, msg: error.message };
        }
    };

    // Cargar datos del usuario desde Firestore
    const updateUserData = async (uid: string) => {
        try {
            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const userData: UserType = {
                    uid: data.uid,
                    email: data.email || null,
                    name: data.name || null,
                    height: data.height || null,
                    weight: data.weight || null,
                    age: data.age || null,
                    activity: data.activity || null,
                    gender: data.gender || null,
                    image: data.image || null,
                };
                setUser(userData);
            }
        } catch (error: any) {
            console.error("Error updating user data:", error.message);
        }
    };

    // Valor del contexto
    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para consumir el contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
