import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, Grid, Button, Icon, Label } from 'semantic-ui-react';
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
    const { data: { getPost } = {} } = useQuery(FETCH_POSTS_QUERY, {
        variables: {
            postId
        }
    })

    function deletePostCallback(){
        navigate("/");
    }

    let postMarkup;
    if(!getPost){
        postMarkup = <p>Chargement du post...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount} = 
        getPost;

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
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

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