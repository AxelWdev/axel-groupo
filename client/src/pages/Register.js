import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react'; 
import { useMutation } from '@apollo/react-hooks'
import { useNavigate } from "react-router-dom";
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks.js';

function Register(props){
    const context = useContext(AuthContext)
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});


    const { onChange, onSubmit, values } = useForm(registerUser, {
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    });


    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, {data: { register: userData}}){
            context.login(userData)
            console.log(userData);
            navigate("/");
        },
        onError(err) {
            setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
        },
        
        variables: values
    })

    function registerUser(){
        addUser();
    }


    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate autoComplete="off" className={loading ? 'loading' : ''}>
                <h1>S'inscrire</h1>
                <Form.Input
                    label="Nom d'utilisateur"
                    placeholder="Nom d'utilisateur..."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username}
                    onChange={onChange} />
                    <Form.Input
                    label="Email"
                    placeholder="Email..."
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email}
                    onChange={onChange} />
                    <Form.Input
                    label="Mot de passe"
                    placeholder="Mot de passe..."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password}
                    onChange={onChange} />
                    <Form.Input
                    label="Confirmez le mot de passe"
                    placeholder="Confirmez le mot de passe..."
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword}
                    onChange={onChange} />
                    <Button type="submit" primary>
                        S'inscrire
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id email username createdAt token isAdmin
        }
    }
`

export default Register;