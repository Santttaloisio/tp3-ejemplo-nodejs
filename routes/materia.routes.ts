import { Router } from 'express'
import {
  getMateriaAll,
  getMateriaById,
  postNewMateria,
  putMateriaById,
  deleteMateriaById
} from '../controllers/materia.controller'

const rutas = Router()

rutas.get('/', getMateriaAll)
rutas.get('/:idMateria', getMateriaById)
rutas.post('/', postNewMateria)
rutas.put('/:idMateria', putMateriaById)
rutas.delete('/:idMateria', deleteMateriaById)

export default rutas
