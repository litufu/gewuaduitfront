import React from 'react';
import {useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ForgetPasswordForm,Loading} from '../../components';

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
  const client = useApolloClient();
  const [forgetPassword, { loading, error }] = useMutation(
    FORGET_PASSWORD_MUTATION,
    {
        onCompleted({ forgetPassword }) {
            client.writeData({ data: { loginStatus: "sendforgetpasswordemailsuccess" } })
        }
      }
  );

  if (loading) return <Loading />;
  if (error) return <p>发送密码重置验证邮件失败。</p>;

  return <ForgetPasswordForm forgetPassword={forgetPassword}/>;
}