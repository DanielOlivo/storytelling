import {Router} from 'express'
import stories from '../controllers/stories'
import verifyToken from '../middlewares/verifyToken'

const router = Router()

router.post('/', [verifyToken], stories.create)
router.put('/', [verifyToken], stories.edit)
router.delete('/', [verifyToken], stories.remove)
router.get('/', [verifyToken], stories.getAll)

export default router