const { Router } = require('express')
const {
  getServicios,
  getServiciosById
} = require('../controllers/serviciosController')

const rutas = Router()

rutas.get('/', getServicios)
rutas.get('/:id', getServiciosById)

module.exports = rutas
