import { Request, Response } from 'express'
import fs from 'fs/promises'
import { AlumnoModel } from '../models/alumno.model'

type AlumnoJson = {
  legajo: number
  nombre: string
  apellido: string
  email: string
  fechaAlta: string
  modificacion: string
  isActive: boolean
}

const alumnosPath = './data/alumnos.json'

const leerAlumnos = async (): Promise<AlumnoJson[]> => {
  const data = await fs.readFile(alumnosPath, 'utf8')
  return JSON.parse(data) as AlumnoJson[]
}

const escribirAlumnos = async (alumnos: AlumnoJson[]): Promise<void> => {
  await fs.writeFile(alumnosPath, JSON.stringify(alumnos, null, 2), 'utf8')
}

const buscarIndexPorLegajo = (
  alumnos: AlumnoJson[],
  legajo: string
): number => {
  const legajoNumber = Number(legajo)

  for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].legajo === legajoNumber) {
      return i
    }
  }

  return -1
}

const buscarIndexPorEmail = (alumnos: AlumnoJson[], email: string): number => {
  const emailNormalizado = email.trim().toLowerCase()

  for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].email.toLowerCase() === emailNormalizado) {
      return i
    }
  }

  return -1
}

const generarNuevoLegajo = (alumnos: AlumnoJson[]): number => {
  let legajoMayor = 10000

  for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].legajo > legajoMayor) {
      legajoMayor = alumnos[i].legajo
    }
  }

  return legajoMayor + 1
}

const obtenerParametro = (parametro: string | string[]): string => {
  return Array.isArray(parametro) ? parametro[0] : parametro
}

export const getAlumnoAll = async (req: Request, res: Response) => {
  try {
    const alumnos = await leerAlumnos()
    let resultado = alumnos

    if (req.query.isActive !== undefined) {
      if (req.query.isActive !== 'true' && req.query.isActive !== 'false') {
        return res.status(400).json({
          error: 'El query param isActive debe ser true o false.'
        })
      }

      const estadoBuscado = req.query.isActive === 'true'
      resultado = resultado.filter((alumno) => alumno.isActive === estadoBuscado)
    }

    if (req.query.apellido !== undefined) {
      const apellidoBuscado = req.query.apellido
        .toString()
        .trim()
        .toLowerCase()

      resultado = resultado.filter((alumno) =>
        alumno.apellido.toLowerCase().includes(apellidoBuscado)
      )
    }

    return res.status(200).json(resultado)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'No se pudieron obtener los datos de los alumnos' })
  }
}

export const getAlumnoById = async (req: Request, res: Response) => {
  const legajo = obtenerParametro(req.params.legajo)

  try {
    const alumnos = await leerAlumnos()
    const index = buscarIndexPorLegajo(alumnos, legajo)

    if (index === -1) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo n° ${legajo}` })
    }

    return res.status(200).json(alumnos[index])
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `No se pudo obtener el detalle del alumno con legajo n° ${legajo}`
    })
  }
}

export const postNewAlumno = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email } = req.body
    const alumnos = await leerAlumnos()

    const indexEmail = buscarIndexPorEmail(alumnos, email)

    if (indexEmail !== -1) {
      return res.status(409).json({
        msg: `Ya existe un alumno registrado con el email ${email}`
      })
    }

    const nuevoLegajo = generarNuevoLegajo(alumnos)
    const nuevoAlumno = new AlumnoModel(
      nombre.trim(),
      apellido.trim(),
      email.trim(),
      nuevoLegajo
    )

    const alumnoNuevo = nuevoAlumno.getAllAttributes()
    alumnos.push(alumnoNuevo)

    await escribirAlumnos(alumnos)

    return res.status(201).json({
      msg: `Se agregó al sistema el alumno nuevo con el legajo n° ${nuevoLegajo}`,
      alumnoNuevo
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo dar de alta el alumno'
    })
  }
}

export const putAlumnoBylegajo = async (req: Request, res: Response) => {
  const legajo = obtenerParametro(req.params.legajo)

  try {
    const { nombre, apellido, email, isActive } = req.body
    const alumnos = await leerAlumnos()
    const index = buscarIndexPorLegajo(alumnos, legajo)

    if (index === -1) {
      return res.status(404).json({
        msg: `No se encontró el alumno con el legajo n° ${legajo}`
      })
    }

    if (email !== undefined) {
      const indexEmail = buscarIndexPorEmail(alumnos, email)

      if (indexEmail !== -1 && indexEmail !== index) {
        return res.status(409).json({
          msg: `Ya existe otro alumno registrado con el email ${email}`
        })
      }
    }

    const alumnoEncontrado = alumnos[index]
    const alumnoModificado = new AlumnoModel(
      alumnoEncontrado.nombre,
      alumnoEncontrado.apellido,
      alumnoEncontrado.email,
      alumnoEncontrado.legajo,
      alumnoEncontrado.fechaAlta,
      alumnoEncontrado.modificacion,
      alumnoEncontrado.isActive
    )

    if (nombre !== undefined) {
      alumnoModificado.setNombre(nombre.trim())
    }

    if (apellido !== undefined) {
      alumnoModificado.setApellido(apellido.trim())
    }

    if (email !== undefined) {
      alumnoModificado.setEmail(email.trim())
    }

    if (isActive !== undefined) {
      alumnoModificado.setIsActive(isActive)
    }

    alumnoModificado.setModificacion(AlumnoModel.getFechaActual())
    alumnos[index] = alumnoModificado.getAllAttributes()

    await escribirAlumnos(alumnos)

    return res.status(200).json({
      msg: `Se modificó correctamente el alumno con legajo n° ${legajo}`,
      alumnoModificado: alumnos[index]
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `No se pudieron modificar los datos del alumno con legajo n° ${legajo}`
    })
  }
}

export const deleteAlumnoByLegajo = async (req: Request, res: Response) => {
  const legajo = obtenerParametro(req.params.legajo)

  try {
    const alumnos = await leerAlumnos()
    const index = buscarIndexPorLegajo(alumnos, legajo)

    if (index === -1) {
      return res.status(404).json({
        msg: `No se encontró el alumno con el legajo n° ${legajo}`
      })
    }

    const alumnoEliminado = alumnos[index]
    alumnos.splice(index, 1)

    await escribirAlumnos(alumnos)

    return res.status(200).json({
      msg: `Se eliminó correctamente el alumno con el legajo n° ${alumnoEliminado.legajo}`,
      alumno: alumnoEliminado
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo eliminar el alumno del sistema'
    })
  }
}
