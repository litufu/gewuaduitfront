import React,{Fragment} from 'react';
import {useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { SignupForm,Loading,MySnackbar} from '../../components';

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
  const [signup, { loading, error }] = useMutation(
    SIGNUP_MUTATION,
    {
      onCompleted({ signup }) {
        localStorage.setItem('userToken', JSON.stringify(signup.user))
        navigate('/')

      }
    }
  );

  if (loading) return <Loading />;

  return (
    <Fragment>
      <SignupForm signup={signup} />
      {error && <MySnackbar message="注册失败！"/>}
    </Fragment>)
}