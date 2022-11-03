import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react'; 
import { useMutation } from '@apollo/react-hooks'
import { useNavigate } from "react-router-dom";
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth.js';
import { useForm } from '../util/hooks.js'

function Login(props){
    const context = useContext(AuthContext)
    
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    
    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: '',
        password: ''
    })

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData}}){
            console.log(userData);
            context.login(userData)
            navigate("/");
        },
        onError(err) {
            setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
        },
        
        variables: values
    })

    function loginUserCallback(){
        
        loginUser();
    }



    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate autoComplete="off" className={loading ? 'loading' : ''}>
                <h1>Se connecter</h1>
                <Form.Input
                    label="Nom d'utilisateur"
                    placeholder="Nom d'utilisateur..."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username}
                    onChange={onChange} />
                    
                    <Form.Input
                    label="Mot de passe"
                    placeholder="Mot de passe..."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password}
                    onChange={onChange} />
                    
                    <Button type="submit" primary>
                        Se connecter
                    </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map((value) => (
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>
        )}
            
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(username: $username, password: $password){
            id 
            email 
            username 
            createdAt 
            token
            isAdmin
        }
    }
`;

export default Login;