import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Signin from './signin';
import Signup from './signup';

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
  }else{
      return <Signin />
  }
}

