"use client"

import Button from '@mui/material/Button';
import Logout from '@mui/icons-material/Logout';

type props = {
    nombre: string
    handleCerrarSesion: () => void
}

export default function Header({nombre, handleCerrarSesion}: props) {
    return(
        <div className="h-[70px] w-full bg-orange-400 flex justify-between items-center p-[5px]">
            <div className='text-white'>
                <span>Bienvenido: <strong>{nombre}</strong></span>
            </div>
            <div>
                <Button 
                    variant="contained" 
                    startIcon={<Logout />}
                    onClick={handleCerrarSesion}
                    sx={{ backgroundColor: "#ff5733", "&:hover": { backgroundColor: "#c70039" } }}>

                    Cerrar sesion
                </Button>
            </div>
        </div>
    )
}