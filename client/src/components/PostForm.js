import React, { useContext } from 'react';
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function PostForm(){
    const { user } = useContext(AuthContext);

    const {values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
        const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: {
                getPosts: [result.data.createPost, ...data.getPosts],
            },
        });
        values.body = "";
        },
    });

    function createPostCallback(){
        createPost()
    }

    return ( user ? (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Créer un post</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Post..."
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                    />
                <Button type="submit" color="teal">
                    Envoyer
                </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" style={{marginBottom: 20}}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        ) }
        </>
        ) : ( 
        <div>
            <p>Connectez vous pour créer un post</p>
        </div>)
    )
    
}

const CREATE_POST_MUTATION = gql`
mutation createPost($body: String!){
    createPost(body: $body) {
        id body createdAt username
        likes{
            id username createdAt
        }
        likeCount
        comments{
            id body username createdAt
        }
        commentCount
    }
}
`

export default PostForm