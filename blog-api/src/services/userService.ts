export default class UserService {
    repository
    constructor(repository) {
        this.repository = repository
    }
    async addAuthor(userid: number) {
        const user = await this.repository.addAuthor(userid)
        return user
    }

    async createUser(userInfo) {
        const { firstname, lastname, username, password, email } = userInfo
        const fullname = firstname + ' ' + lastname
        const user = await this.repository.createUser(
            fullname,
            email,
            username,
            password,
        )
        return user
    }

    async getUser(userid: number) {
        const user = await this.repository.getUser(userid)
        return user
    }
    // update user
    // delete user
}
