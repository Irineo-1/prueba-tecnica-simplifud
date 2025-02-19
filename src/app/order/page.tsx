"use client"

import { useEffect, useState } from "react";
import { getOrders } from "@/request/Order";
import { useRouter } from 'next/navigation';
import Tabla from "../../componentes/Tabla";
import { IHeadersTabla } from "../../interfaces/ITabla";
import { IOrder } from "../../interfaces/IOrder";
import { formatearFecha, formatearHora } from "../../utils/Fecha";
import Modal from "../../componentes/Modal";
import DialogContentText from '@mui/material/DialogContentText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import SuccsessAlert from "../../componentes/Success";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs} from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import Header from "../../componentes/Header";
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { setCorreo } from "@/redux/usuario";
import { cerrarSesion } from "@/request/Autenticacion";

dayjs.extend(customParseFormat)

const headers: IHeadersTabla[] = [
    {
        titulo: "Numero de orden",
        valor: "order_num"
    },{
        titulo: "Medio de ingreso",
        valor: "channel"
    },{
        titulo: "Fecha de creacion",
        valor: "created_at_visual"
    },{
        titulo: "Nombre del cliente",
        valor: "customer_name"
    },{
        titulo: "Fecha de entrega",
        valor: "delivery_date_visual"
    },{
        titulo: "Hora de entrega",
        valor: "delivery_time_visual"
    }
]

export default function Order() {

    const [orders, setOrders] = useState<IOrder[]>([])
    const [TotalOrders, setTotalOrders] = useState<IOrder[]>([])
    
    const [openEdit, setOpenEdit] = useState(false)
    const [openEliminar, setOpenEliminar] = useState(false)
    const [openCerrarSesion, setOpenCerrarSesion] = useState(false)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false)

    const [ordenActual, setOrdenActual] = useState<IOrder | null>(null)
    const [rangoInicial, setRangoInicial] = useState<Dayjs | null>(null)
    const [rangoFinal, setRangoFinal] = useState<Dayjs | null>(null)

    const correo = useAppSelector(state => state.user.correo)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const verOrden = (orden: IOrder) => {
        setOrdenActual(orden)
        setOpenEdit(true)
    }

    const eliminarOrden = (orden: IOrder) => {
        setOrdenActual(orden)
        setOpenEliminar(true)
    }

    const confirmacionEliminarOrden = () => {
        setOrders(orders => orders.filter(el => el.id !== ordenActual?.id))
        setOpenEliminar(false)
        setOpenSuccessAlert(true)
    }

    const confirmarCerrarSesion = () => {
        cerrarSesion()
        .then((res) => {
            if(res.success) {
                dispatch(setCorreo(""))
                router.push("/login")
            }
            else {
                console.error(res.message)
            }
        })
    }

    useEffect(() => {
        // Este parametro que recive getOrders es para simular una respuesta de tipo 401
        getOrders(200).then(ordersResponse => {
            ordersResponse.map(el => {
                el.created_at_visual = formatearFecha(el.created_at, true)
                el.delivery_date_visual = formatearFecha(el.delivery_date)
                el.delivery_time_visual = formatearHora(el.delivery_time)
            })
            setTotalOrders(ordersResponse)
            setOrders(ordersResponse)
        })
        .catch(err => {
            console.error(err)
        })
    }, [])

    useEffect(() => {
        if(rangoInicial === null || rangoFinal === null) return

        let ordenesFiltradas = TotalOrders.filter(el => {
            let fechaParsed = dayjs(el.created_at);       
            return fechaParsed.isValid() && fechaParsed.isAfter(rangoInicial) && fechaParsed.isBefore(rangoFinal)
        })

        setOrders(ordenesFiltradas)
    }, [rangoInicial, rangoFinal])

    return(
        <>        
            <Header nombre={correo} handleCerrarSesion={() => setOpenCerrarSesion(true)}/>
            <div className="flex justify-center w-full h-[100vh]">
                <div className="w-full md:w-auto mt-4">
                    <div className="flex justify-between flex-wrap h-[200px] md:h-[110px] mb-3 pb-[10px] border-b-4 border-b-orange-400">
                        <div className="flex justify-end flex-col">
                            <span>Bienvenidos a <strong>comercializadora la noria</strong></span>
                            <span className="text-3xl">Mis pedidos</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="block h-10">Rango de fechas</span>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div className="flex space-x-3">
                                    <DatePicker
                                        label="valor inicial"
                                        value={rangoInicial}
                                        onChange={(newValue) => {
                                            if (newValue !== null) {
                                                setRangoInicial(newValue);
                                            }
                                        }}
                                    />
                                    <DatePicker
                                        label="valor Final"
                                        value={rangoFinal}
                                        onChange={(newValue) => {
                                            if (newValue !== null) {
                                                setRangoFinal(newValue);
                                            }
                                        }}
                                    />
                                </div>
                            </LocalizationProvider>
                        </div>
                    </div>
                    <Tabla headers={headers} data={orders} deleteData={eliminarOrden} seeData={verOrden} acciones={true}/>
                </div>
            </div>

            <Modal open={openEdit} setOpen={setOpenEdit} handleConfirmar={() => setOpenEdit(false)} titulo="Orden" textoBotonConfirmar="Aceptar">
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Numero de orden"
                            secondary={`Ap-${ordenActual?.order_num}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Medio de ingreso"
                            secondary={ordenActual?.channel}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Fecha de creación"
                            secondary={ordenActual?.created_at_visual}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Nombre del cliente"
                            secondary={ordenActual?.customer_name}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Fecha de entrega"
                            secondary={ordenActual?.delivery_date_visual}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Hora de entrega"
                            secondary={ordenActual?.delivery_time_visual}
                        />
                    </ListItem>
                </List>
            </Modal>

            <Modal open={openEliminar} setOpen={setOpenEliminar} handleConfirmar={confirmacionEliminarOrden} titulo={`Eliminar Registro con la orden: ${ordenActual?.order_num}`} textoBotonConfirmar="Aceptar">
                <DialogContentText>
                    ¿Seguro que desea eliminar el registro?
                </DialogContentText>
            </Modal>

            <Modal open={openCerrarSesion} setOpen={setOpenCerrarSesion} handleConfirmar={confirmarCerrarSesion} titulo={`cerrar sesion`} textoBotonConfirmar="Aceptar">
                <DialogContentText>
                    ¿Seguro que desea cerrar sesion?
                </DialogContentText>
            </Modal>

            <SuccsessAlert open={openSuccessAlert} setOpen={setOpenSuccessAlert} mensage="Registro eliminado exitosamente"/>
        </>
    )
}