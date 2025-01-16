import {Router} from 'express'
import contributors from '../controllers/contributors'

const router = Router()

router.post('/', contributors.addCollaborator)
router.delete('/', contributors.removeCollaborator)

export default router