import React,{ useState,useEffect } from 'react';
import gql from 'graphql-tag';
import queryString from'query-string';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {validatePassword} from '../utils'
import MadeWithLove from './madein'

export const GET_EMAIL_HAS_TAKEN = gql`
  query emailHasTaken($email: String!) {
    emailHasTaken(email: $email)
  }
`;

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

export default function ResetPasswordForm(props) {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [resetPasswordToken, setResetPasswordToken] = useState("");

  useEffect(() => {
    const resetPasswordToken = queryString.parse(props.location.search).resetPasswordToken
    if(resetPasswordToken) {
        setResetPasswordToken(resetPasswordToken)
    }
  },[props.location.search]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          修改密码
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="密码"
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value) }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmpassword"
                label="确认密码"
                type="password"
                id="confirmpassword"
                value={password2}
                helperText="密码需要包含大小写字母、数字、特殊字符并且长短不小于10."
                onChange={e => setPassword2(e.target.value) }
              />
            </Grid>
            
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!(password===password2 && validatePassword(password))}
            onClick={(e) => {
                e.preventDefault()
                props.resetPassword({ variables: { password, resetPasswordToken} });
              }}
          >
            修改密码
          </Button>
        </form>
      </div>
      <Box mt={5}>
        <MadeWithLove />
      </Box>
    </Container>
  );
}