import { Request, Response } from 'express'
import fs from 'fs/promises'
import { MateriaModel } from '../models/materia.model'

type MateriaJson = {
  idMateria: string
  nombre: string
  cuatrimestre: number
}

const materiasPath = './data/materias.json'

const leerMaterias = async (): Promise<MateriaJson[]> => {
  const data = await fs.readFile(materiasPath, 'utf8')
  return JSON.parse(data) as MateriaJson[]
}

const escribirMaterias = async (materias: MateriaJson[]): Promise<void> => {
  await fs.writeFile(materiasPath, JSON.stringify(materias, null, 2), 'utf8')
}

const normalizarIdMateria = (idMateria: string): string => {
  return idMateria.trim().toUpperCase()
}

const obtenerParametro = (parametro: string | string[]): string => {
  return Array.isArray(parametro) ? parametro[0] : parametro
}

const obtenerQueryParam = (parametro: unknown): string | undefined => {
  if (parametro === undefined) {
    return undefined
  }

  if (Array.isArray(parametro)) {
    return String(parametro[0])
  }

  return String(parametro)
}

const buscarIndexPorIdMateria = (
  materias: MateriaJson[],
  idMateria: string
): number => {
  const idBuscado = normalizarIdMateria(idMateria)

  for (let i = 0; i < materias.length; i++) {
    if (normalizarIdMateria(materias[i].idMateria) === idBuscado) {
      return i
    }
  }

  return -1
}

export const getMateriaAll = async (req: Request, res: Response) => {
  try {
    const materias = await leerMaterias()
    let resultado = materias

    const cuatrimestre = obtenerQueryParam(req.query.cuatrimestre)

    if (cuatrimestre !== undefined) {
      const cuatrimestreNumber = Number(cuatrimestre)

      if (!Number.isInteger(cuatrimestreNumber) || cuatrimestreNumber <= 0) {
        return res.status(400).json({
          error: 'El query param cuatrimestre debe ser un número entero mayor a 0.'
        })
      }

      resultado = resultado.filter(
        (materia) => materia.cuatrimestre === cuatrimestreNumber
      )
    }

    const nombre = obtenerQueryParam(req.query.nombre)

    if (nombre !== undefined) {
      const nombreBuscado = nombre.trim().toLowerCase()

      resultado = resultado.filter((materia) =>
        materia.nombre.toLowerCase().includes(nombreBuscado)
      )
    }

    return res.status(200).json(resultado)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'No se pudieron obtener los datos de las materias' })
  }
}

export const getMateriaById = async (req: Request, res: Response) => {
  const idMateria = obtenerParametro(req.params.idMateria)

  try {
    const materias = await leerMaterias()
    const index = buscarIndexPorIdMateria(materias, idMateria)

    if (index === -1) {
      return res.status(404).json({
        msg: `No existe la materia con el id ${idMateria}`
      })
    }

    return res.status(200).json(materias[index])
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `No se pudo obtener el detalle de la materia con id ${idMateria}`
    })
  }
}

export const postNewMateria = async (req: Request, res: Response) => {
  try {
    const { idMateria, nombre, cuatrimestre } = req.body
    const materias = await leerMaterias()
    const idMateriaNormalizado = normalizarIdMateria(idMateria)
    const index = buscarIndexPorIdMateria(materias, idMateriaNormalizado)

    if (index !== -1) {
      return res.status(409).json({
        msg: `Ya existe una materia registrada con el id ${idMateriaNormalizado}`
      })
    }

    const nuevaMateria = new MateriaModel(
      idMateriaNormalizado,
      nombre.trim(),
      cuatrimestre
    )

    const materiaNueva = nuevaMateria.getAllAttributes()
    materias.push(materiaNueva)

    await escribirMaterias(materias)

    return res.status(201).json({
      msg: `Se agregó al sistema la materia nueva con el id ${idMateriaNormalizado}`,
      materiaNueva
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo dar de alta la materia'
    })
  }
}

export const putMateriaById = async (req: Request, res: Response) => {
  const idMateria = obtenerParametro(req.params.idMateria)

  try {
    const { nombre, cuatrimestre } = req.body
    const materias = await leerMaterias()
    const index = buscarIndexPorIdMateria(materias, idMateria)

    if (index === -1) {
      return res.status(404).json({
        msg: `No se encontró la materia con el id ${idMateria}`
      })
    }

    const materiaEncontrada = materias[index]
    const materiaModificada = new MateriaModel(
      materiaEncontrada.idMateria,
      materiaEncontrada.nombre,
      materiaEncontrada.cuatrimestre
    )

    if (nombre !== undefined) {
      materiaModificada.setNombre(nombre.trim())
    }

    if (cuatrimestre !== undefined) {
      materiaModificada.setCuatrimestre(cuatrimestre)
    }

    materias[index] = materiaModificada.getAllAttributes()

    await escribirMaterias(materias)

    return res.status(200).json({
      msg: `Se modificó correctamente la materia con id ${idMateria}`,
      materiaModificada: materias[index]
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `No se pudieron modificar los datos de la materia con id ${idMateria}`
    })
  }
}

export const deleteMateriaById = async (req: Request, res: Response) => {
  const idMateria = obtenerParametro(req.params.idMateria)

  try {
    const materias = await leerMaterias()
    const index = buscarIndexPorIdMateria(materias, idMateria)

    if (index === -1) {
      return res.status(404).json({
        msg: `No se encontró la materia con el id ${idMateria}`
      })
    }

    const materiaEliminada = materias[index]
    materias.splice(index, 1)

    await escribirMaterias(materias)

    return res.status(200).json({
      msg: `Se eliminó correctamente la materia con id ${materiaEliminada.idMateria}`,
      materia: materiaEliminada
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo eliminar la materia del sistema'
    })
  }
}
