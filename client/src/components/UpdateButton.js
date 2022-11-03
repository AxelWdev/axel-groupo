import React from 'react';
import { Link } from 'react-router-dom'

import { Button, Icon } from 'semantic-ui-react';

function UpdateButton({postId}){
    return (
        <>
            <Button
                style={{marginLeft:10}}
                as={Link}
                to={`/posts/${postId}`}>
                <Icon name="edit" style={{margin: 0}}></Icon>
            </Button>
        </>
    )
}

export default UpdateButton;