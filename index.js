const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const helmet = require('helmet')
const {
  GraphQLUpload, // The GraphQL "Upload" Scalar
  graphqlUploadExpress, // The Express middleware.
} = require('graphql-upload');


const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers');




const server = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    context: ({ req }) => ({req})
});

const app = express(); 
app.use(graphqlUploadExpress()); 

server.applyMiddleware({ app }); 
app.use(cors());
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false, 
                crossOriginEmbedderPolicy: false,
                crossOriginResourcePolicy: false, }));
app.use(express.static('public'));





mongoose.connect(process.env.MONGO_DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !')
);


app.listen({ port: 5000}, () => {
    console.log(`Server ready at http://localhost:5000`);
})
