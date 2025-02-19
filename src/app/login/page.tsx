"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Password from '@mui/icons-material/Password';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorAlert from '../../componentes/Error';
import { useAppDispatch } from '@/redux/hooks'
import { setCorreo } from '@/redux/usuario';
import { ICredenciales } from "@/interfaces/IAutenticacion"
import { Autenticacion } from '@/request/Autenticacion';

export default function Login() {

  const [showPassword, setShowPassword] = useState(false)
  const [showError, setShowError] = useState(false)
  const [mensageError, setMensageError] = useState("")
  const [correoForm, setCorreoForm] = useState("")
  const [errorCorreo, setErrorCorreo] = useState(false)
  const [password, setPassword] = useState("")

  const router = useRouter()

  const dispatch = useAppDispatch()

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleAutenticar = () => {

    if(errorCorreo) {
      setShowError(true)
      setMensageError('Correo no valido')

      return
    }

    const credenciales: ICredenciales = {
      email: correoForm,
      password: password
    }

    Autenticacion(credenciales)
    .then((res) => {
      if(res.success) {
        console.log(correoForm)
        dispatch(setCorreo(correoForm))
        router.push("/order")
      }else {
        setShowError(true)
        setMensageError(res.message || 'Error generico')
      }
    })
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    handleAutenticar()
  }

  useEffect(() => {
    const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

    if(correoForm.trim() == "") return setErrorCorreo(false)

    const correoValido = correoForm.match(regex)

    if(correoValido == null) return setErrorCorreo(true)
    setErrorCorreo(false)
  
  }, [correoForm])

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <form className='w-[80%] h-[70%] md:w-[450px] md:h-[550px] rounded-[20px] shadow-2xl p-[50px] flex justify-center items-center flex-col space-y-5'>
        <AccountCircle sx={{ fontSize: 100, color: '#1976d2' }} />
        <TextField 
          label="Usuario"
          value={correoForm}
          error={errorCorreo}
          onChange={e => setCorreoForm(e.target.value)}
          fullWidth={true}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField 
          label="Password" 
          fullWidth={true}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyUp={handleKeyUp}
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Password />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'ocultar password' : 'mostrar password'
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            },
          }}
        />
        <Button 
          variant="contained" 
          disabled={correoForm.trim() === "" || password.trim() === ""}
          onClick={handleAutenticar}>
            Iniciar sesion
        </Button>
      </form>

      <ErrorAlert open={showError} setOpen={setShowError} mensage={mensageError}/>
    </div>
  )
}