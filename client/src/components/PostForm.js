import React, { useContext, useRef } from 'react';
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function PostForm(){
    const inputRef = useRef(null);
    const { user } = useContext(AuthContext);

    const {values, onChange, onSubmit } = useForm(createPostCallback, {
        body: '',
        url:''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: { body: values.body, url: values.url},
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
        values.url = "";
        },
    });

    
    
    const [uploadFile] = useMutation(UPLOAD_FILE, {
        onCompleted(data){
            values.url = data.uploadFile.url;
            
        }

    })

    const handleFileChange = e => {
        const file = e.target.files[0]
        
        if(!file) return
        uploadFile({variables: { file }})
        
    }


    const resetFileInput = () => {
    //  reset input value
    inputRef.current.value = null;
};
        
    


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
                <div className="submit-text-image-button">
                    <input 
            type="file"
            accept="image/*" 
            onChange={handleFileChange}
            ref={inputRef} />
                <Button 
                type="submit" 
                color="teal"
                onClick={resetFileInput}>
                    Envoyer
                </Button>
                
            
            
            </div>

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
mutation createPost($body: String!, $url:String!){
    createPost(body: $body, url: $url) {
        id body url createdAt username
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

const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload!){
        uploadFile(file: $file){
            url
        }
    }
`

export default PostForm