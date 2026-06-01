const { Router } = require('express')
const {
  getMateriaAll,
  getMateriaById,
  createMateria,
  updateMateria,
  deleteMateria
} = require('../../controllers/extras/materia.controller')

const rutas = Router()

rutas.get('/', getMateriaAll)
rutas.get('/:idMateria', getMateriaById)
rutas.post('/', createMateria)
rutas.put('/:idMateria', updateMateria)
rutas.delete('/:idMateria', deleteMateria)

module.exports = rutas
