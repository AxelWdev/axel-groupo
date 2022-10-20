const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs')
const resolvers=require('./graphql/resolvers');






const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({req})
});

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('MongoDB Connected');
        return server.listen({port: 5000})
    .then(res => {
        console.log(`Server is running at ${res.url}`);
    });
    })
