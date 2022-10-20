import React, { useContext, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Card, Grid, Button, Icon, Label, Form, Transition } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/fr';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton'

import {AuthContext} from '../context/auth';

moment.locale('fr');

function SinglePost(props) {
    const navigate = useNavigate();
    const { postId } = useParams();
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const[comment, setComment] = useState('');

    const { data: { getPost } = {} } = useQuery(FETCH_POSTS_QUERY, {
        variables: {
            postId
        }
    })

    const[submitComment]=useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback(){
        navigate("/");
    }

    let postMarkup;
    if(!getPost){
        postMarkup = <p>Chargement du post...</p>
    } else {
        const { id,
            body, 
            createdAt, 
            username, 
            comments, 
            likes, 
            likeCount, 
            commentCount
        } = getPost;

        postMarkup = (
            <Grid style={{marginTop: 20}}>
                <Grid.Row>
                    <Grid.Column>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                                <Button
                                    as='div'
                                    labelPosition='right'
                                    onClick={() => console.log('Comment Post')}>
                                        <Button basic color='blue'>
                                            <Icon name='comments'></Icon>
                                        </Button>
                                        <Label basic color='blue' pointing='left'>
                                            {commentCount}
                                        </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Postez un commentaire</p>
                                <Form>
                                    <div className='ui action input fluid'>
                                        <input
                                        type='text'
                                        placeholder='commentaire...'
                                        name='comment'
                                        value={comment}
                                        onChange={event => setComment(event.target.value)}
                                        ref={commentInputRef} />
                                        <button type='submit'
                                            className='ui button teal'
                                            disabled={comment.trim() === ''}
                                            onClick={submitComment}>Envoyer</button>
                                    </div>
                                </Form>
                                </Card.Content>
                            </Card>
                        )}
                        <Transition.Group>
                        {comments.map(comment => (
                            
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {user && user.username === comment.username && (
                                            <DeleteButton postId={id} commentId={comment.id}/>
                                        )}
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                        <Card.Description>{comment.body}</Card.Description>
                                    </Card.Content>
                                </Card>
                            
                        ))}
                        </Transition.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_POSTS_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`

export default SinglePost;