import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AUTH_TOKEN } from '../../constant'
import { SignupForm,Loading} from '../../components';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        name
        id
      }
    }
  }
`

export default function Signup(props) {
  const client = useApolloClient();
  const [signup, { loading, error }] = useMutation(
    SIGNUP_MUTATION,
    {
      onCompleted({ signup }) {
        localStorage.setItem(AUTH_TOKEN, signup.token);
        localStorage.setItem('userToken', JSON.stringify(signup.user))
        client.writeData({ data: { isLoggedIn: true } });
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <p>登陆失败。</p>;

  return <SignupForm signup={signup} />;
}