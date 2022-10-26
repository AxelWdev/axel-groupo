const { AuthenticationError, UserInputError } = require('apollo-server');
const fs = require('fs');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');


module.exports = {
    Query:{
        async getPosts(){
            try{
                const posts = await Post.find().sort({ createdAt: -1 }); 
                return posts;
            }
            catch(err){
                throw new Error(err); 
            }
        },
        async getPost(_, { postId }){
            try {
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else {
                    throw new Error("Post non trouvé");
                }
            } catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body, url }, context){
            const user = checkAuth(context);
            
            if(body.trim() === '' || url.trim() === ''){
                throw new Error('Le post doit contenir du texte et une image')
            }


            const newPost = new Post({
                body,
                user: user.id,
                username:user.username,
                createdAt: new Date().toISOString(),
                url
            });

            const post = await newPost.save();
            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

        try {
            const post = await Post.findById(postId);
            if (user.username === post.username) {
                let url = post.url;
                let fileName = url.split('/').pop();
                
                fs.unlink(`public/images/${fileName}`, function(){console.log("Deleted image")});
                await post.delete();
                return 'Post supprimé avec succès';
            } else {
            throw new AuthenticationError('Action non autorisée');
            }
            } catch (err) {
                throw new Error(err);
            }
        }, 
        async likePost(_, { postId }, context){
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            if(post){
                if(post){
                    if(post.likes.find(like => like.username === username)){
                        // Post déjà liké, unlike
                        post.likes = post.likes.filter(like => like.username !== username);
                        
                    } else {
                        // Pas liké, like
                        post.likes.push({
                            username,
                            createdAt: new Date().toISOString()
                        })
                    }

                }
                await post.save();
                return post;
            } else throw new UserInputError('Post non trouvé');
        }
    }
}
