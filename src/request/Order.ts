"use server"

import { IOrder } from "@/interfaces/IOrder"
import { cookies } from 'next/headers';
import { refreshToken } from "./Autenticacion";

export const getOrders = async (status: number): Promise<IOrder[]> => {

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    const fetchReetry = async () => {
        const responde: Response = await fetch("https://67aa117865ab088ea7e58c36.mockapi.io/api/v1/order")
    
        // headers: {
        //     Authorization: `Bearer ${accessToken}`,
        // },

        if(status == 401) {
            const refreshTokenCookie = cookieStore.get('refresh_token')?.value
            
            if(!refreshTokenCookie) throw new Error("No hay token de refrsh")
            
            const newToken = await refreshToken(false)

            if(!newToken.success) throw new Error("No se pudo refrescar el token")

            cookieStore.set({
                name: 'access_token',
                value: newToken.message,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                sameSite: 'strict',
                maxAge: 60,
                path: '/' 
            })

            status = 200

            return fetchReetry()
        }
    
        if(!responde.ok) throw new Error("Error al traer los datos")
    
        const data: IOrder[] = await responde.json()

        return data
    }

    return fetchReetry()
}