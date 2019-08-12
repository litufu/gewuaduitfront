import React, { Fragment } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Location,navigate } from "@reach/router"
import { AUTH_TOKEN } from '../../constant'
import { ResetPasswordForm,Loading,MySnackbar} from '../../components';

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($password: String!, $resetPasswordToken: String!) {
    resetPassword(password: $password, resetPasswordToken: $resetPasswordToken) {
      token
      user {
        name
        id
      }
    }
  }
`

export default function ResetPassword(props) {
  const [resetPassword, { loading, error }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      onCompleted({ resetPassword }) {
        localStorage.setItem(AUTH_TOKEN, resetPassword.token);
        localStorage.setItem('userToken', JSON.stringify(resetPassword.user))
        navigate('/')
      }
    }
  );

  if (loading) return <Loading />;

  return (
    <Fragment>
    <Location>
        {({ location })=> {
        return <ResetPasswordForm 
            resetPassword={resetPassword} 
            location={location}
        />
        }}
  </Location>
  {error && <MySnackbar message="修改密码失败。"/>}
  </Fragment>
  );
  
}