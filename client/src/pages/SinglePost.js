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
    const inputRef = useRef(null);
    const[updateUrl, setUpdateUrl]=useState('');
    const[updateBody, setUpdateBody]=useState('');
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

    const [updatePost, { error }] = useMutation(UPDATE_POST_MUTATION, {
        variables: {
            postId,
            body: updateBody,
            url: updateUrl,
        },
        onCompleted(){
            setUpdateUrl("");
            setUpdateBody("");
        }
        
    });

    const [uploadFile] = useMutation(UPLOAD_FILE, {
        onCompleted(data){
            setUpdateUrl(data.uploadFile.url);
            console.log(data)
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
            commentCount,
            url
        } = getPost;

        postMarkup = (
            <Grid style={{marginTop: 20}}>
                { user && (user.username === username || user.isAdmin) && <>
                <Grid.Row>
                <Form onSubmit={() => updatePost()} style={{padding: 14}}>
                    <h2>Modifier le post</h2>
                    <Form.Field>
                        <Form.Input
                            placeholder="Post..."
                            name="body"
                            onChange={(e) => setUpdateBody(e.target.value)}
                            error={error ? true : false}
                            autoComplete="off"
                            value={updateBody}
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
                        {error && (
                            <div className="ui error message" style={{marginBottom: 20}}>
                                <ul className="list">
                                    <li>{error.graphQLErrors[0].message}</li>
                                </ul>
                            </div>
                    ) }

                    </Form.Field>
                    
                </Form>
                </Grid.Row>
                </>}
                <Grid.Row>
                    
                    <Grid.Column>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>
                                    <div className='card-desc'>
                                        {body}
                                    </div>
                                    
                                </Card.Description>
                                <div className="flex-center">
                                        <div className="post-image-container-single">
                                            <img src={url} alt='post' className="post-image-single"></img>
                                        </div>
                                    </div>
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
                                {user && (user.username === username || user.isAdmin) && (
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
                                        ref={commentInputRef}
                                        autoComplete='off' />
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
                                        {user && (user.username === comment.username || user.isAdmin) && (
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
            id body url createdAt username likeCount
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

const UPDATE_POST_MUTATION = gql`
    mutation($postId: ID!, $body: String!, $url: String!){
        updatePost(postId: $postId, body: $body, url: $url){
            id body url createdAt username likeCount
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

const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload!){
        uploadFile(file: $file){
            url
        }
    }
`


export default SinglePost;