export default class UserService {
    repository
    constructor(repository) {
        this.repository = repository
    }
    async addAuthor(userid: number) {
        const user = await this.repository.addAuthor(userid)
        return user
    }

    async createUser(firstname, lastname, username, password, email, author) {
        const fullname = firstname + ' ' + lastname
        const user = await this.repository.createUser(
            fullname,
            email,
            username,
            password,
        )
        const addAuthor = author === 'true'
        if (addAuthor) {
            const userid = user.id
            const user2 = await this.addAuthor(userid)
            return user2
        }
        return user
    }

    async getUser(userid: number) {
        const user = await this.repository.getUser(userid)
        return user
    }
    // update user
    // delete user
}
