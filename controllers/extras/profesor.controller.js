const fs = require('fs').promises

const DATA_PATH = './data/extras/sys-profesores.json'

const leerProfesores = async () => {
  const data = await fs.readFile(DATA_PATH, 'utf8')
  return data.trim() ? JSON.parse(data) : []
}

const guardarProfesores = async (profesores) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(profesores, null, 2))
}

const getProfesorAll = async (req, res) => {
  try {
    const profesores = await leerProfesores()
    return res.status(200).json(profesores)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudieron obtener los profesores' })
  }
}

const getProfesorById = async (req, res) => {
  try {
    const profesores = await leerProfesores()
    const { idProfesor } = req.params

    const profesor = profesores.find((p) => p.idProfesor === idProfesor)

    if (!profesor) {
      return res.status(404).json({ msg: `No existe el profesor ${idProfesor}` })
    }

    return res.status(200).json(profesor)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo obtener el profesor' })
  }
}

const createProfesor = async (req, res) => {
  try {
    const profesores = await leerProfesores()
    const nuevoProfesor = req.body

    const existe = profesores.some((p) => p.idProfesor === nuevoProfesor.idProfesor)

    if (existe) {
      return res.status(400).json({ msg: `Ya existe el profesor ${nuevoProfesor.idProfesor}` })
    }

    profesores.push(nuevoProfesor)
    await guardarProfesores(profesores)

    return res.status(201).json(nuevoProfesor)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo crear el profesor' })
  }
}

const updateProfesor = async (req, res) => {
  try {
    const profesores = await leerProfesores()
    const { idProfesor } = req.params

    const index = profesores.findIndex((p) => p.idProfesor === idProfesor)

    if (index === -1) {
      return res.status(404).json({ msg: `No existe el profesor ${idProfesor}` })
    }

    profesores[index] = { ...profesores[index], ...req.body, idProfesor }
    await guardarProfesores(profesores)

    return res.status(200).json(profesores[index])
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo modificar el profesor' })
  }
}

const deleteProfesor = async (req, res) => {
  try {
    const profesores = await leerProfesores()
    const { idProfesor } = req.params

    const profesor = profesores.find((p) => p.idProfesor === idProfesor)

    if (!profesor) {
      return res.status(404).json({ msg: `No existe el profesor ${idProfesor}` })
    }

    const profesoresFiltrados = profesores.filter((p) => p.idProfesor !== idProfesor)
    await guardarProfesores(profesoresFiltrados)

    return res.status(200).json({ msg: 'Profesor eliminado correctamente' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo eliminar el profesor' })
  }
}

module.exports = {
  getProfesorAll,
  getProfesorById,
  createProfesor,
  updateProfesor,
  deleteProfesor
}
