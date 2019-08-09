import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Signin from './signin';
import Signup from './signup';
import ForgetPassword from './forget-password';
import SendForgetPasswordEmailSuccess from  './send-forget-password-email-success'

const LOGIN_STATUS = gql`
  query LoginStatus {
    loginStatus @client
  }
`;

export default function Login() {
  const { data } = useQuery(LOGIN_STATUS);

  if(data.loginStatus==="signin"){
      return <Signin />
  }else if(data.loginStatus==="signup"){
      return <Signup />
  }else if(data.loginStatus==="forgetpassword"){
    return <ForgetPassword />
  }else if(data.loginStatus==="sendforgetpasswordemailsuccess"){
    return <SendForgetPasswordEmailSuccess />
  }else{
      return <Signin />
  }
}

