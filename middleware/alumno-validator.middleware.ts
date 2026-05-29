import { NextFunction, Request, Response } from 'express'
import { AlumnoModel } from '../models/alumno.model'

export const validateInputAlumno = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const esAlta = req.method === 'POST'
    const errores = AlumnoModel.validarDatos(req.body, esAlta)

    if (req.method === 'PUT' && Object.keys(req.body).length === 0) {
        errores.push('Debe enviar al menos un dato para modificar.')
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: errores })
    }

    next()
}
