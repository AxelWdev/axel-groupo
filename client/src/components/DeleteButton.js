import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';


import { Card, Button, Icon, Confirm } from 'semantic-ui-react';



function DeleteButton({ postId, callback }){
    const [ confirmOpen, setConfirmOpen] = useState(false);

    const[deletePost] = useMutation(DELETE_POST_MUTATION, {
        variables: { 
            postId
        },
        update(proxy, res) {
            setConfirmOpen(false);
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY,
            });
        res = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: res } });
        if (callback) callback();
    }
    })
    return (
        <>
            <Card.Content className='delete-container'>
                <Button className='delete-button' 
                    as='div' 
                    color='red' 
                    floated="right"
                    onClick={() => setConfirmOpen(true)}>
                    <Icon name='trash' style={{margin: 0}}/>
                </Button>
                <Confirm
                    open={confirmOpen}
                    onCancel={() =>setConfirmOpen(false)}
                    onConfirm={deletePost}
                    content='Êtes-vous sûr(e) de vouloir supprimer ce post ?'
                    cancelButton='Annuler'
                    confirmButton="Supprimer" />
            </Card.Content>
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)

        
    }
`

export default DeleteButton;