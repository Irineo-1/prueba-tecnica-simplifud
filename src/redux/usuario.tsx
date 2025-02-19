import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInfoUsuario } from "@/interfaces/IUsuario";
import { RootState } from "./store";

const initialState: IInfoUsuario = {
    correo: ""
}

export const usuario = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCorreo: (state, action: PayloadAction<string>) => {
            state.correo = action.payload
        }
    }
})

export const { setCorreo } = usuario.actions
export const getCorreo = (state: RootState) => state.user.correo

export default usuario.reducer