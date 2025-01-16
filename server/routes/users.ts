import {Router} from 'express'
import userController from '../controllers/users'
import { validateLoginCredentials } from '../middlewares/loginCredentialsValidator'
import { validateCredentials } from '../middlewares/credentialsValidator'

const router = Router()

router.post('/login', [validateLoginCredentials], userController.login)
router.post('/register', [validateCredentials], userController.register)

export default router