import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:"column",
    alignItems:"center"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 500,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const natures = [
  {
    value: 'STATEOWNED',
    label: '国有企业',
  },
  {
    value: 'LISTED',
    label: '上市公司',
  },
  {
    value: 'PLANNEDLISTED',
    label: '拟上市公司',
  },
  {
    value: 'OTHER',
    label: '私营企业及其他',
  },
];

const types = [
    {
      value: 'DOMESTIC',
      label: '境内企业',
    },
    {
      value: 'OUTLANDS',
      label: '境外企业',
    },
  ];

export default function CreateCustomer() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: '',
    code: '',
    type: 'DOMESTIC',
    nature: 'OTHER',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <Container component="main" maxWidth="xs">
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        新建客户
      </Typography>
    <form className={classes.container} noValidate autoComplete="off">
     <TextField
        id="standard-name1"
        label="公司名称"
        className={classes.textField}
        value={values.name}
        onChange={handleChange('name')}
        margin="normal"
      />
      <TextField
        id="standard-select-currency"
        select
        label="公司类型"
        className={classes.textField}
        value={values.type}
        onChange={handleChange('type')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        helperText="请选择公司类型"
        margin="normal"
      >
        {types.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      {
      values.type==="DOMESTIC" && (
        <TextField
        id="standard-name2"
        label="统一社会信用代码"
        className={classes.textField}
        value={values.code}
        onChange={handleChange('code')}
        margin="normal"
      />
      )
      }
    <TextField
        id="standard-select-currency"
        select
        label="公司性质"
        className={classes.textField}
        value={values.nature}
        onChange={handleChange('nature')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        helperText="请选择公司性质"
        margin="normal"
      >
        {natures.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      
      <Button 
      variant="contained" 
      fullWidth
      className={classes.button}>
        提交
      </Button>
    </form>
    </div>
    </Container>
  );
}