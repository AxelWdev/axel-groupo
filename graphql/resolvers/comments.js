const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require ('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {
        createComment: async (_, {postId, body}, context) => {
            const { username } = checkAuth(context);
            if(body.trim() === '') {
                throw new UserInputError('Commentaire Vide', {
                    errors: {
                        body: 'Le commentaire ne doit pas être vide'
                    }
                })
            }

            const post = await Post.findById(postId);

            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError('Post non trouvé')
        },
        async deleteComment(_, { postId, commentId }, context){
            const { username, isAdmin } = checkAuth(context);

            const post = await Post.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                
                if(post.comments[commentIndex].username === username || isAdmin){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action non autorisée')
                }
            } else {
                throw new UserInputError('Post non trouvé')
            }
        }
    }
}