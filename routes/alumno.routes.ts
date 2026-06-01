import { Router } from 'express'
import {
  getAlumnoAll,
  getAlumnoById,
  postNewAlumno
} from '../controllers/alumno.controller'
import { validateInputAlumno } from '../middleware/alumno-validator.middleware'

const rutas = Router()

rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoById)
rutas.post('/', validateInputAlumno, postNewAlumno)

export default rutas