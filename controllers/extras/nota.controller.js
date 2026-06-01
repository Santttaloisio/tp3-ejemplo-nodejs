const fs = require('fs').promises

const DATA_PATH = './data/extras/sys-notas.json'

const leerNotas = async () => {
  const data = await fs.readFile(DATA_PATH, 'utf8')
  return data.trim() ? JSON.parse(data) : []
}

const guardarNotas = async (notas) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(notas, null, 2))
}

const getNotaAll = async (req, res) => {
  try {
    const notas = await leerNotas()
    return res.status(200).json(notas)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudieron obtener las notas' })
  }
}

const getNotaById = async (req, res) => {
  try {
    const notas = await leerNotas()
    const { id } = req.params

    const nota = notas.find((n) => n.id === Number(id))

    if (!nota) {
      return res.status(404).json({ msg: `No existe la nota con id ${id}` })
    }

    return res.status(200).json(nota)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo obtener la nota' })
  }
}

const createNota = async (req, res) => {
  try {
    const notas = await leerNotas()
    const nuevoId = notas.length > 0 ? Math.max(...notas.map((n) => n.id)) + 1 : 1
    const nuevaNota = { id: nuevoId, ...req.body }

    notas.push(nuevaNota)
    await guardarNotas(notas)

    return res.status(201).json(nuevaNota)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo crear la nota' })
  }
}

const updateNota = async (req, res) => {
  try {
    const notas = await leerNotas()
    const { id } = req.params
    const idNumber = Number(id)

    const index = notas.findIndex((n) => n.id === idNumber)

    if (index === -1) {
      return res.status(404).json({ msg: `No existe la nota con id ${id}` })
    }

    notas[index] = { ...notas[index], ...req.body, id: idNumber }
    await guardarNotas(notas)

    return res.status(200).json(notas[index])
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo modificar la nota' })
  }
}

const deleteNota = async (req, res) => {
  try {
    const notas = await leerNotas()
    const { id } = req.params
    const idNumber = Number(id)

    const nota = notas.find((n) => n.id === idNumber)

    if (!nota) {
      return res.status(404).json({ msg: `No existe la nota con id ${id}` })
    }

    const notasFiltradas = notas.filter((n) => n.id !== idNumber)
    await guardarNotas(notasFiltradas)

    return res.status(200).json({ msg: 'Nota eliminada correctamente' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo eliminar la nota' })
  }
}

module.exports = {
  getNotaAll,
  getNotaById,
  createNota,
  updateNota,
  deleteNota
}
