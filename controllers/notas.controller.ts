import fs from 'fs/promises'
import { Request, Response } from 'express'
import { Nota, NotasModel } from '../models/notas.model'

const notasPath = './data/notas.json'

const leerNotas = async (): Promise<Nota[]> => {
  const data = await fs.readFile(notasPath, 'utf8')
  return JSON.parse(data)
}

const escribirNotas = async (
  notas: Nota[]
): Promise<void> => {
  await fs.writeFile(
    notasPath,
    JSON.stringify(notas, null, 2),
    'utf8'
  )
}

const buscarIndexPorId = (
  notas: Nota[],
  id: number
): number => {
  return notas.findIndex(
    (nota) => nota.id === id
  )
}
const generarNuevoId = (
  notas: Nota[]
): number => {
  let maxId = 0

  for (const nota of notas) {
    if (nota.id > maxId) {
      maxId = nota.id
    }
  }

  return maxId + 1
}

export const getNotasAll = async (
  req: Request,
  res: Response
) => {
  try {
    let notas = await leerNotas()

    if (req.query.legajo) {
      const legajo = Number(req.query.legajo)

      notas = notas.filter(
        (n) => n.legajo === legajo
      )
    }

    if (req.query.idMateria) {
      notas = notas.filter(
        (n) =>
          n.idMateria === req.query.idMateria
      )
    }

    return res.status(200).json(notas)
  } catch {
    return res.status(500).json({
      error: 'No se pudieron obtener las notas'
    })
  }
}

type NotaParams = {
  id: string
}

export const getNotaById = async (
  req: Request<NotaParams>,
  res: Response
) => {
  try {
    const notas = await leerNotas()

    const index = buscarIndexPorId(
      notas,
      Number(req.params.id)
    )

    if (index === -1) {
      return res.status(404).json({
        msg: 'Nota no encontrada'
      })
    }

    return res.status(200).json(
      notas[index]
    )
  } catch {
    return res.status(500).json({
      error: 'No se pudo obtener la nota'
    })
  }
}

export const createNota = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      legajo,
      idMateria,
      nota
    } = req.body

    const notas = await leerNotas()

    const nuevoId = generarNuevoId(notas)

    const nuevaNota = new NotasModel(
      nuevoId,
      legajo,
      idMateria,
      nota
    )

    notas.push(
      nuevaNota.getAllAttributes()
    )

    await escribirNotas(notas)

    return res.status(201).json({
      msg: 'Nota creada correctamente',
      nota: nuevaNota.getAllAttributes()
    })
  } catch {
    return res.status(500).json({
      error: 'No se pudo crear la nota'
    })
  }
}

export const updateNota = async (
  req: Request<NotaParams>,
  res: Response
) => {
  try {
    const notas = await leerNotas()

    const index = buscarIndexPorId(
      notas,
      Number(req.params.id)
    )

    if (index === -1) {
      return res.status(404).json({
        msg: 'Nota no encontrada'
      })
    }

    const notaActual = notas[index]

    const notaModificada =
      new NotasModel(
        notaActual.id,
        notaActual.legajo,
        notaActual.idMateria,
        notaActual.nota,
        notaActual.fecha
      )

    if (req.body.nota !== undefined) {
      notaModificada.setNota(
        req.body.nota
      )
    }

    notas[index] =
      notaModificada.getAllAttributes()

    await escribirNotas(notas)

    return res.status(200).json({
      msg: 'Nota modificada correctamente',
      nota: notas[index]
    })
  } catch {
    return res.status(500).json({
      error: 'No se pudo modificar la nota'
    })
  }
}

export const deleteNota = async (
  req: Request<NotaParams>,
  res: Response
) => {
  try {
    const notas = await leerNotas()

    const index = buscarIndexPorId(
      notas,
      Number(req.params.id)
    )

    if (index === -1) {
      return res.status(404).json({
        msg: 'Nota no encontrada'
      })
    }

    const notaEliminada = notas[index]

    notas.splice(index, 1)

    await escribirNotas(notas)

    return res.status(200).json({
      msg: 'Nota eliminada correctamente',
      nota: notaEliminada
    })
  } catch {
    return res.status(500).json({
      error: 'No se pudo eliminar la nota'
    })
  }
}