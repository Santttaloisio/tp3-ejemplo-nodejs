import { NextFunction, Request, Response } from 'express'
import { NotasModel } from '../models/notas.model'
import fs from 'fs/promises'

export const validateInputNota = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const esAlta = req.method === 'POST'

    const errores = NotasModel.validarDatos(
        req.body,
        esAlta
    )

    if (
        req.method === 'PUT'

    ) {
        if (Object.keys(req.body).length === 0) {
            errores.push(
                'Debe enviar al menos un dato para modificar.'
            )
        } else if (req.body.nota === undefined) {
            errores.push(
                'Debe enviar una nota para modificar.'
            )
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({
            error: errores
        })
    }

    next()
}

const alumnosPath = './data/alumnos.json'
const materiasPath = './data/materias.json'
const notasPath = './data/notas.json'

export const validateRelacionNota = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { legajo, idMateria } = req.body

        const alumnos = JSON.parse(
            await fs.readFile(alumnosPath, 'utf8')
        )

        const materias = JSON.parse(
            await fs.readFile(materiasPath, 'utf8')
        )

        const notas = JSON.parse(
            await fs.readFile(notasPath, 'utf8')
        )

        const alumnoExiste = alumnos.some(
            (alumno: any) =>
                alumno.legajo === legajo
        )

        if (!alumnoExiste) {
            return res.status(404).json({
                error: `No existe el alumno con legajo ${legajo}`
            })
        }

        const materiaExiste = materias.some(
            (materia: any) =>
                materia.idMateria === idMateria
        )

        if (!materiaExiste) {
            return res.status(404).json({
                error: `No existe la materia ${idMateria}`
            })
        }

        const notaDuplicada = notas.some(
            (nota: any) =>
                nota.legajo === legajo &&
                nota.idMateria === idMateria
        )

        if (notaDuplicada) {
            return res.status(409).json({
                error:
                    'Ya existe una nota registrada para ese alumno y materia.'
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            error:
                'No se pudieron validar los datos de la nota.'
        })
    }
}