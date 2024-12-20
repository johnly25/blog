import bcrypt from 'bcryptjs'
const SALT_ROUNDS = 8

export const hashPassword = async password => {
    console.log('hasing')
    return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}
