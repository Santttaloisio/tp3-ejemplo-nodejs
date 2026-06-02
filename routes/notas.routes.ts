import { Router } from 'express'

import {
  getNotasAll,
  getNotaById,
  createNota,
  updateNota,
  deleteNota
} from '../controllers/notas.controller'
import { validateInputNota, validateRelacionNota } from '../middleware/notas-validator.middleware'

const router = Router()

router.get('/', getNotasAll)
router.get('/:id', getNotaById)

router.post(
  '/',
  validateInputNota,
  validateRelacionNota,
  createNota
)

router.put(
  '/:id',
  validateInputNota,
  updateNota
)

router.delete('/:id', deleteNota)

export default router