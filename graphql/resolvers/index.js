const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const uploadResolvers = require('./upload');
const {
  GraphQLUpload, // The GraphQL "Upload" Scalar
  graphqlUploadExpress, // The Express middleware.
} = require('graphql-upload');


module.exports = {
    Upload: GraphQLUpload,
    Post:{
        likeCount:(parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...uploadResolvers.Mutation
    }
}