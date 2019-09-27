import React, { Fragment } from 'react';
import { Router } from '@reach/router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Container from '@material-ui/core/Container';
import Main from './main';
import Profile from './profile';
import CreateCustomer from './new/create-customer'
import Signin from './auth/signin'
import ResetPassword from './auth/reset-password';
import ValidateEmail from './auth/validate-email';
import ForgetPassword from './auth/forget-password'
import WaitForEmailValidated from './auth/wait-for-validate-email'
import Sendforgetpasswordemailsuccess from './auth/send-forget-password-email-success'
import Signup from './auth/signup'
import Settings from './settings';
import UploadData from './new/upload-data'
import CreateProject from './new/create-project'
import Project from './project'
import CheckImportData from './project/check-import-data'

const IS_LOGGEDIN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

export default function App() {

function PagesPart(){
    return(
      <Router primary={false} component={Fragment}>
        <Main path="/" />
        <ValidateEmail path="validateEmail" />
        <Settings path="settings" />
        <Profile path="profile"/>
        <CreateCustomer path="createcustomer" />
        <UploadData path="uploaddata" />
        <CreateProject path="createproject" />
        <Project path="project/:projectId" />
        <CheckImportData path="checkProject/:projectId" />
        {/* <Main default /> */}
      </Router> 
    )
}

function LoginPart(){
  return (
    <Router primary={false} component={Fragment}>
      <Signin path="/" />
      <Signup path="signup" />
      <ResetPassword path="resetPassword" />
      <ValidateEmail path="validateEmail" />
      <ForgetPassword path="forgetPassword" />
      <WaitForEmailValidated path="waitForEmailValidated" />
      <Sendforgetpasswordemailsuccess path="sendforgetpasswordemailsuccess" />
      <Signin default />
    </Router>
  )
}

  function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGEDIN)
    return data.isLoggedIn ? <PagesPart /> : <LoginPart />;
  }

  return (
    <Fragment>
      <Container>
        <IsLoggedIn />
      </Container>
    </Fragment>
  );
}