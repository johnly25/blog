export default class UserService {
    repository
    constructor(repository) {
        this.repository = repository
    }

    async createUser(userInfo) {
        const { firstname, lastname, username, password, email } = userInfo
        console.log(firstname + lastname, username, password, email)
        const fullname = firstname + ' ' + lastname
        const user = await this.repository.createUser(
            fullname,
            email,
            username,
            password,
        )
        return user
    }
    // read user
    // update user
    // delete user
}
