import {Router} from 'express'
import stories from '../controllers/stories'

const router = Router()

router.post('/', stories.create)
router.put('/', stories.edit)
router.delete('/', stories.remove)

export default router