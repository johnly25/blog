import { test, expect } from 'vitest'
import * as bcrypt from './bcryptService'

test('hash password', async () => {
    const password = '123'
    const hashPassword = await bcrypt.hashPassword(password)
})
