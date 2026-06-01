const { Router } = require('express')
const {
  getNotaAll,
  getNotaById,
  createNota,
  updateNota,
  deleteNota
} = require('../../controllers/extras/nota.controller')

const rutas = Router()

rutas.get('/', getNotaAll)
rutas.get('/:id', getNotaById)
rutas.post('/', createNota)
rutas.put('/:id', updateNota)
rutas.delete('/:id', deleteNota)

module.exports = rutas
