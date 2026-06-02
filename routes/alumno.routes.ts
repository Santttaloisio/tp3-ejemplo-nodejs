import { Router } from 'express'

import {
  getAlumnoAll,
  getAlumnoById,
  postNewAlumno,
  putAlumnoBylegajo,
  deleteAlumnoByLegajo
} from '../controllers/alumno.controller'

import { validateInputAlumno } from '../middleware/alumno-validator.middleware'

const rutas = Router()

rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoById)
rutas.post('/', validateInputAlumno, postNewAlumno)
rutas.put('/:legajo', validateInputAlumno, putAlumnoBylegajo)
rutas.delete('/:legajo', deleteAlumnoByLegajo)

export default rutas