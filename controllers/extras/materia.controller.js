const fs = require('fs').promises

const DATA_PATH = './data/extras/sys-materias.json'

const leerMaterias = async () => {
  const data = await fs.readFile(DATA_PATH, 'utf8')
  return data.trim() ? JSON.parse(data) : []
}

const guardarMaterias = async (materias) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(materias, null, 2))
}

const getMateriaAll = async (req, res) => {
  try {
    const materias = await leerMaterias()
    return res.status(200).json(materias)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudieron obtener las materias' })
  }
}

const getMateriaById = async (req, res) => {
  try {
    const materias = await leerMaterias()
    const { idMateria } = req.params

    const materia = materias.find((m) => m.idMateria === idMateria)

    if (!materia) {
      return res.status(404).json({ msg: `No existe la materia ${idMateria}` })
    }

    return res.status(200).json(materia)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo obtener la materia' })
  }
}

const createMateria = async (req, res) => {
  try {
    const materias = await leerMaterias()
    const nuevaMateria = req.body

    const existe = materias.some((m) => m.idMateria === nuevaMateria.idMateria)

    if (existe) {
      return res.status(400).json({ msg: `Ya existe la materia ${nuevaMateria.idMateria}` })
    }

    materias.push(nuevaMateria)
    await guardarMaterias(materias)

    return res.status(201).json(nuevaMateria)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo crear la materia' })
  }
}

const updateMateria = async (req, res) => {
  try {
    const materias = await leerMaterias()
    const { idMateria } = req.params

    const index = materias.findIndex((m) => m.idMateria === idMateria)

    if (index === -1) {
      return res.status(404).json({ msg: `No existe la materia ${idMateria}` })
    }

    materias[index] = { ...materias[index], ...req.body, idMateria }
    await guardarMaterias(materias)

    return res.status(200).json(materias[index])
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo modificar la materia' })
  }
}

const deleteMateria = async (req, res) => {
  try {
    const materias = await leerMaterias()
    const { idMateria } = req.params

    const materia = materias.find((m) => m.idMateria === idMateria)

    if (!materia) {
      return res.status(404).json({ msg: `No existe la materia ${idMateria}` })
    }

    const materiasFiltradas = materias.filter((m) => m.idMateria !== idMateria)
    await guardarMaterias(materiasFiltradas)

    return res.status(200).json({ msg: 'Materia eliminada correctamente' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo eliminar la materia' })
  }
}

module.exports = {
  getMateriaAll,
  getMateriaById,
  createMateria,
  updateMateria,
  deleteMateria
}
