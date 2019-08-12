import React, { Fragment } from 'react';
import { Router } from '@reach/router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Container from '@material-ui/core/Container';
import Main from './main';
import Profile from './profile';
import CreateCustomer from './create-customer'
import Login from './auth/login'
import ResetPassword from './auth/reset-password';
import ValidateEmail from './auth/validate-email';
import Settings from './settings';
// import { Footer, PageContainer } from '../components';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export default function App() {

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn 
  ? (<Router primary={false} component={Fragment}>
    <Main path="/" />
    <ValidateEmail path="validateEmail" />
    <Settings path="settings" />
    <Profile path="profile"/>
    <CreateCustomer path="createcustomer" />
    {/* <Main default /> */}
  </Router> )
  : (<Router primary={false} component={Fragment}>
    <Login path="/" />
    <ResetPassword path="resetPassword" />
    <ValidateEmail path="validateEmail" />
    <Login default />
  </Router>);
}
  return (
    <Fragment>
      <Container>
        <IsLoggedIn />
      </Container>
    </Fragment>
  );
}