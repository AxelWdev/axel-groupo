import React, { useContext } from 'react';
import { Card,  Image, Button, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/fr';
import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
moment.locale('fr');





function PostCard({ 
  post: {body, createdAt, id, username, likeCount, commentCount, likes, url} 
}) {

    const { user } = useContext(AuthContext);

  
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta >{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>
          {body}
          <div className="post-image-container">
            <img src={url} alt='post' className="post-image"></img>
          </div>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{id, likes, likeCount}}/>
        <Button  labelPosition='right' as={Link} to={`/posts/${id}`}>
          <Button color='blue' basic>
            <Icon name='comments' />
          </Button>
          <Label  basic color='blue' pointing='left'>
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
      { user && (user.username === username || user.isAdmin) && <DeleteButton postId={id}/>}
      
    </Card>
  )
}

export default PostCard;