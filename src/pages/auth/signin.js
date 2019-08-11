import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AUTH_TOKEN } from '../../constant'
import { LoginForm,Loading} from '../../components';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        emailvalidated
        id
      }
    }
  }
`

export default function Login(props) {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted({ login }) {
        localStorage.setItem(AUTH_TOKEN, login.token);
        localStorage.setItem('userToken', JSON.stringify(login.user))
        if(login.user.emailvalidated){
          client.writeData({ data: { isLoggedIn: true } });
        }else{
          client.writeData({ data: { loginStatus: "waitforemailvalidated" } });
        }
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <MySnackbar message="登陆失败！"/>;

  return <LoginForm login={login}/>;
}