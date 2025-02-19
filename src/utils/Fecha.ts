import dayjs from "dayjs";
import 'dayjs/locale/es';

export const formatearFecha = (date: Date, tieneHora?: boolean ) => {
    let formatoHora = ""
    if(tieneHora) formatoHora = "- hh:mm A"
    const fecha = dayjs(date).locale('es').format(`DD/MMMM/YYYY ${formatoHora}`).replace(/\/([a-záéíóúñ])/u, (m) => '/' + m[1].toUpperCase())
    return fecha
}

export const formatearHora = (date: Date) => {
    const fecha = dayjs(date).format(`hh:mm A`)
    return fecha
}