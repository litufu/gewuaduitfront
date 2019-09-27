import React,{Fragment} from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { AUTH_TOKEN } from '../../constant'
import { LoginForm,Loading,MySnackbar} from '../../components';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        emailvalidated
        id
        role
      }
    }
  }
`

export default function Login(props) {
  const client = useApolloClient()
  const [login, { loading, error }] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted({ login }) {
        if(login.user.emailvalidated){
          localStorage.setItem(AUTH_TOKEN, login.token);
          localStorage.setItem('userToken', JSON.stringify(login.user))
          client.writeData({
            data: {
              isLoggedIn: true,
            },
          })
        }else{
          navigate("waitForEmailValidated")
        }
      }
    }
  );

  if (loading) return <Loading />;

  return (
    <Fragment>
      <LoginForm login={login}/>
      {error && <MySnackbar message="登陆失败！"/>}
    </Fragment>)
}