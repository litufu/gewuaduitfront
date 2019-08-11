import React, { Fragment } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { Header } from '../components'

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}

export default function App() {
  return (
    <Fragment>
      <Header />
      <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create1 React App v4-beta example
        </Typography>
        <MadeWithLove />
      </Box>
      </Container>
    </Fragment>
  );
}