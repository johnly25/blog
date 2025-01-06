export default class CommentService {
    repository
    constructor(repository) {
        this.repository = repository
    }

    async getComments(postid: number) {
        return this.repository.getComments(postid)
    }
    async createComment(userid, postid, commentBody) {
        return this.repository.createComment(userid, postid, commentBody)
    }

    async updateComment(commentid, commentBody) {
        return this.repository.updateComment(commentid, commentBody)
    }

    async deleteComment(commentid) {
        return this.repository.deleteComment(commentid)
    }
}
