"use server"
import { ICredenciales, statusResponseApi } from "@/interfaces/IAutenticacion"
import { cookies } from 'next/headers';

export const Autenticacion = async (credenciales: ICredenciales): Promise<statusResponseApi> => {

    try {
        const response = await fetch("https://reqres.in/api/login", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(credenciales)
        })
    
        const res = await response.json();

        if(!response.ok) throw new Error(res.error || "Error en la autenticación")
    
        const cookieStore = await cookies()
        cookieStore.set({
            name: 'access_token',
            value: res.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 60,
            path: '/' 
        })

        cookieStore.set({
            name: 'refresh_token',
            value: res.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 25,
            path: '/' 
        })

        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : "Correo o contraseña incorrectas" };
    }
    
}

// El parametro falla del refresh token es para simular cuando falla este
export const refreshToken = async (falla: boolean) => {
    try{
        const cookieStore = await cookies()

        const token = cookieStore.get('refresh_token')?.value

        // Simula el refresh
        // const response: Response = await fetch("https:IP/refresh"{
        //     method: 'POST',
        //     headers: {
        //     'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ token }),
        // })

        // const res = await response.json();
    
        // if(!response.ok) throw new Error(res.error || "Error en el refresh")

        if(falla) throw new Error("Error en el refresh")

        return { success: true, message: "Nuevo token de res" }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : "Error desconocido" };
    }
}

export const cerrarSesion = async (): Promise<statusResponseApi> => {

    try{
        // Simula la peticion a cerrar sesion
        // const response: Response = await fetch("https:IP/cerrarsesion")

        // const res = await response.json();
    
        // if(!response.ok) throw new Error(res.error || "Error en la peticion")
    
        const cookieStore = await cookies()
        cookieStore.delete('access_token')
        cookieStore.delete('refresh_token')
    
        return { success: true }
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : "Error desconocido" };
    }
}