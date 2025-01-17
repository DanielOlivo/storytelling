import {Router} from 'express'
import contributors from '../controllers/contributors'
import verifyToken from '../middlewares/verifyToken'

const router = Router()

router.post('/', [verifyToken], contributors.addCollaborator)
router.delete('/', [verifyToken], contributors.removeCollaborator)

export default router