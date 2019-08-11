import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Location,navigate } from "@reach/router"
import { AUTH_TOKEN } from '../../constant'
import { ResetPasswordForm,Loading} from '../../components';

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
  if (error) return <MySnackbar message="修改密码失败。"/>;

  return (
    <Location>
        {({ location })=> {
        return <ResetPasswordForm 
            resetPassword={resetPassword} 
            location={location}
        />
        }}
  </Location>
  );
  
}