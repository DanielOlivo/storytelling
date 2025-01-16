import {Router} from 'express'
import userController from '../controllers/users'

const router = Router()

router.post('/login', userController.login)
router.post('/register', userController.register)

export default router