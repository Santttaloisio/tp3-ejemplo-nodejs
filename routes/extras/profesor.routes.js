const { Router } = require('express')
const {
  getProfesorAll,
  getProfesorById,
  createProfesor,
  updateProfesor,
  deleteProfesor
} = require('../../controllers/extras/profesor.controller')

const rutas = Router()

rutas.get('/', getProfesorAll)
rutas.get('/:idProfesor', getProfesorById)
rutas.post('/', createProfesor)
rutas.put('/:idProfesor', updateProfesor)
rutas.delete('/:idProfesor', deleteProfesor)

module.exports = rutas
