const { Router } = require('express')
const {
  getAlumnoAll,
  getAlumnoById
} = require('../controllers/alumno.controller')

const rutas = Router()

rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoById)

module.exports = rutas
