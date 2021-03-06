import React,{useEffect} from 'react';
import {useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { AUTH_TOKEN } from '../../constant'
import { Loading ,MySnackbar} from '../../components';
import queryString from'query-string';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {MadeWithLove} from '../../components'

const VALIDATE_EMAIL_TOKEN_MUTATION = gql`
  mutation ValidateEmailMutation($validateEmailToken: String!) {
    validateEmail(validateEmailToken: $validateEmailToken) {
      token
      user {
        name
        emailvalidated
        id
      }
    }
  }
`
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
  content: {
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

export default function ValidateEmail(props) {
  const client = useApolloClient()
  const classes = useStyles();
  const [validateEmail, { loading, error }] = useMutation(
    VALIDATE_EMAIL_TOKEN_MUTATION,
    {
      onCompleted({ validateEmail }) {
        localStorage.setItem(AUTH_TOKEN, validateEmail.token);
        localStorage.setItem('userToken', JSON.stringify(validateEmail.user))
        client.writeData({
          data: {
            isLoggedIn: true,
            emailValidated:true
          },
        })
        navigate("/main")
      }
    }
  );

  useEffect(() => {
    const validateEmailToken = queryString.parse(props.location.search).validateEmailToken
    if(validateEmailToken) {
        validateEmail({ variables: { validateEmailToken } })
    }
  });

  if (loading) return <Loading />;

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            验证成功
          </Typography>
        </div>
        <Box mt={5}>
          <MadeWithLove />
        </Box>
        {error && <MySnackbar message={error.message}/>}
      </Container>
  );
  
}