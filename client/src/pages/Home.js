import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react'


import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function Home(){
    
    const { loading, data: { getPosts: posts} = {} } = useQuery(FETCH_POSTS_QUERY);
    if(posts){
        console.log(posts);
    }
    return (
        <div>
            <Grid columns={3}>
                <Grid.Row className='page-title'>
                    <h1>Derniers posts</h1>
                </Grid.Row>
                <Grid.Row>
                    
                        <Grid.Column>
                            <PostForm/>
                        </Grid.Column>
                    
                    { loading ? (
                        <h1>Chargement des posts...</h1>
                    ) : (
                        <Transition.Group>
                            { posts && posts.map((post) => (
                            <Grid.Column key={post.id} style={{ marginBottom: 15 }}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))}
                        </Transition.Group>
                    )}
                </Grid.Row>
            </Grid>
        </div>
    );
}

export default Home;