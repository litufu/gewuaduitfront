import React,{Fragment} from 'react';
import gql from 'graphql-tag';
import {useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Loading,MySnackbar,Header} from '../components';


export const GET_ME = gql`
  query Me {
    me{
      id
      name
      email
      accountingFirm{
        id
        name
      }
    }
  }
`;


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:"column"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
}));

export default function Profile() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_ME,{
    fetchPolicy:"network-only"
  });
  if(loading) return <Loading />

  return (
      <Fragment>
          <Header />
          <Typography variant="h6"  gutterBottom>
        个人信息
      </Typography>
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        disabled
        fullWidth
        id="outlined-disabled1"
        label="姓名"
        defaultValue={data.me.name}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    <TextField
        disabled
        id="outlined-disabled1"
        label="邮箱"
        defaultValue={data.me.email}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    <TextField
        disabled
        id="outlined-disabled2"
        label="会计师事务所"
        defaultValue={data.me.accountingFirm ? data.me.accountingFirm.name : ""}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
      {error && <MySnackbar message={"获取个人信息失败"} />}
    </form>
    </Fragment>
  );
}