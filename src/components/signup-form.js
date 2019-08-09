import React,{ useState } from 'react';
import { useApolloClient } from "@apollo/react-hooks";
import gql from 'graphql-tag';
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
import Tooltip from '@material-ui/core/Tooltip';
import validator from 'email-validator'
import {validatePassword} from '../utils'

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

export default function SignUp(props) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [openTip, setOpenTip] = useState(false);
  const [password, setPassword] = useState("");
  const client = useApolloClient();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          注 册
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="姓名"
                name="name"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value) }
              />
            </Grid>
            <Grid item xs={12}>
                <Tooltip open={openTip} title="邮箱已被注册" placement="right">
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="邮箱"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value) }
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="密码"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                helperText="密码需要包含大小写字母、数字、特殊字符并且长短不小于10."
                onChange={e => setPassword(e.target.value) }
              />
            </Grid>
            
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!(validator.validate(email)&&validatePassword(password))}
            onClick={async (e) => {
                e.preventDefault()
                const { data } = await client.query({
                  query: GET_EMAIL_HAS_TAKEN,
                  variables: { email },
                });
                if(data.emailHasTaken){
                    setOpenTip(data.emailHasTaken);
                    console.log('1')
                    return false
                }else{
                    console.log('2')
                    props.signup({ variables: { email, password,name} });
                }
              }}
          >
            注 册
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
                <Button variant='text'
                    onClick={() => client.writeData({ data: { loginStatus: "signin" } })}
                >已有账号? 请登录
                </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <MadeWithLove />
      </Box>
    </Container>
  );
}