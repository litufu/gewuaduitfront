import React, { Fragment } from 'react';
import { Router } from '@reach/router';
import Container from '@material-ui/core/Container';
import Main from './main';
// import Cart from './cart';
// import Profile from './profile';
// import { Footer, PageContainer } from '../components';

export default function App() {
  return (
    <Fragment>
      <Container>
        <Router primary={false} component={Fragment}>
          <Main path="/" />
        </Router>
      </Container>
    </Fragment>
  );
}