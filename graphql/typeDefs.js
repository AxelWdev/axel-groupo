const { gql } = require('apollo-server');



module.exports = gql`
    scalar Upload
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
        url: String!
    }
    type File {
        url: String!
    }
    type Comment{
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }
    type User{
        id:ID!
        email:String!
        token:String!
        username:String!
        createdAt:String!
        isAdmin: Boolean!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post
        hello: String!
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body:String!, url:String!): Post!
        deletePost(postId: ID!): String
        createComment(postId:String!, body:String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
        uploadFile(file: Upload!): File!
        updatePost(postId: ID!, body:String!, url: String!): Post!
    }
`;