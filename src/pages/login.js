import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AUTH_TOKEN } from '../constant'
import { LoginForm,Loading} from '../components';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        id
      }
    }
  }
`

export default function Login() {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted({ login }) {
        localStorage.setItem(AUTH_TOKEN, login.token);
        localStorage.setItem('userToken', JSON.stringify(login.user))
        client.writeData({ data: { isLoggedIn: true } });
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <p>登陆失败。</p>;

  return <LoginForm login={login} />;
}