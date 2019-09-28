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
import SujbectBalance from './project/subject-balance';
import ChronologicalAccount from './project/chronological-account'

const IS_LOGGEDIN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

const HAS_EMAILVALIDATED = gql`
query EmailValidated {
  emailValidated @client
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
        <SujbectBalance path="getSubjectBalcance/:projectId" />
        <ChronologicalAccount path="chronologicalAccount" />
        
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


function HasLoginPart(){
  return (
    <Router primary={false} component={Fragment}>
      <ResetPassword path="resetPassword" />
      <ValidateEmail path="validateEmail" />
      <ForgetPassword path="forgetPassword" />
      <WaitForEmailValidated path="waitForEmailValidated" />
      <Sendforgetpasswordemailsuccess path="sendforgetpasswordemailsuccess" />
      <WaitForEmailValidated default />
    </Router>
  )
}



  function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGEDIN)
    const { data:myData } = useQuery(HAS_EMAILVALIDATED)
    if(data.isLoggedIn && myData.emailValidated){
      return <PagesPart />
    }else if(data.isLoggedIn && !myData.emailValidated){
      return <HasLoginPart />
    }else{
      return <LoginPart />
    }
    
  }

  return (
    <Fragment>
      <Container>
        <IsLoggedIn />
      </Container>
    </Fragment>
  );
}