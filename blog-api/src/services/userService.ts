export default class UserService {
    repository
    constructor(repository) {
        this.repository = repository
    }

    async getPosts(authorid: number) {
        const posts = await this.repository.getPosts(authorid)
        return posts
    }

    async createPost(authorid: any, title: any, body: any, published: boolean) {
        const post = await this.repository.createPost(
            authorid,
            title,
            body,
            published,
        )
        return post
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
