import React,{ useState,useEffect } from 'react';
import { useApolloClient } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import queryString from'query-string';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ResendEmail from './resend-email'

export const GET_EMAIL_HAS_TAKEN = gql`
  query emailHasTaken($email: String!) {
    emailHasTaken(email: $email)
  }
`;

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

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon: {
    margin: theme.spacing(1),
    fontSize: 15,
  },
}));

export default function ValidateEmailShow(props) {
  const classes = useStyles();
  const client = useApolloClient();

  useEffect(() => {
    const validateEmailToken = queryString.parse(props.location.search).validateEmailToken
    if(validateEmailToken) {
        props.validateEmail(validateEmailToken)
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          请验证你的邮箱
        </Typography>
        <Typography variant="body1" gutterBottom>
          在使用格物在线审计前，你必须验证你的邮箱。我们已经向你的邮箱发送了一封验证邮件，请点击链接验证。
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          没有收到邮件，点击
          <ResendEmail />
        。
        </Typography>
        
      </div>
      <Box mt={5}>
        <MadeWithLove />
      </Box>
    </Container>
  );
}