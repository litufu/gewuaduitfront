import React, { Fragment } from 'react';
import {useMutation } from '@apollo/react-hooks';
import { navigate } from "@reach/router"
import gql from 'graphql-tag';
import { ForgetPasswordForm,Loading,MySnackbar} from '../../components';

const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgetPasswordMutation($email: String!) {
    forgetPassword(email: $email) {
      name
      id
      resetPasswordExpires
    }
  }
`

export default function ForgetPassword(props) {
  const [forgetPassword, { loading, error }] = useMutation(
    FORGET_PASSWORD_MUTATION,
    {
        onCompleted({ forgetPassword }) {
          navigate("sendforgetpasswordemailsuccess")
        }
      }
  );

  if (loading) return <Loading />;

  return (
    <Fragment>
      <ForgetPasswordForm forgetPassword={forgetPassword}/>
      {error && <MySnackbar message="发送密码重置验证邮件失败。"/>}
    </Fragment>
  );
}