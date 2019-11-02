import React from 'react';
import clsx from 'clsx';
import { navigate } from "@reach/router"
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { Loading,ProjectHeader} from '../../components';

const GET_RATE = gql`
  query getRate($currencyType: String!,$date:String!) {
    getRate(currencyType: $currencyType,date:$date) 
  }
`;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

const currencies = [
  {
    value: '港币',
    label: '港币',
  },
  {
    value: '美元',
    label: '美元',
  },
  {
    value: '欧元',
    label: '欧元',
  },
  {
    value: '新加坡元',
    label: '新加坡元',
  },
  {
    value: '日元',
    label: '日元',
  },
  {
    value: '泰国铢',
    label: '泰国铢',
  },
  {
    value: '韩国元',
    label: '韩国元',
  },
  {
    value: '英镑',
    label: '英镑',
  },
  {
    value: '加拿大元',
    label: '加拿大元',
  },
  {
    value: '澳大利亚元',
    label: '澳大利亚元',
  },
  {
    value: '瑞士法郎',
    label: '瑞士法郎',
  },
  {
    value: '瑞典克朗',
    label: '瑞典克朗',
  },
  {
    value: '丹麦克朗',
    label: '丹麦克朗',
  },
  {
    value: '挪威克朗',
    label: '挪威克朗',
  },
  {
    value: '新西兰元',
    label: '新西兰元',
  },
  {
    value: '卢布',
    label: '卢布',
  },
  {
    value: '马来西亚元',
    label: '马来西亚元',
  },
  {
    value: '南非兰特',
    label: '南非兰特',
  },
  {
    value: '巴西雷亚尔',
    label: '巴西雷亚尔',
  },
  {
    value: '匈牙利福林',
    label: '匈牙利福林',
  },
  {
    value: '马来西亚元',
    label: '马来西亚元',
  },
  {
    value: '土耳其里拉',
    label: '土耳其里拉',
  },
  {
    value: '墨西哥比索',
    label: '墨西哥比索',
  },
  {
    value: '波兰兹罗提',
    label: '波兰兹罗提',
  },
  {
    value: '阿联酋迪拉姆',
    label: '阿联酋迪拉姆',
  },


];

export default function GetRate(props) {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    date: '2018-12-31',
    currencyType: '美元',
  });
  const [getRate, { loading, data }] = useLazyQuery(GET_RATE);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
      <div>
          <ProjectHeader
    onClick={()=>navigate(`/project/${props.projectId}`)}
    title="汇率查询"
   />
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="standard-name"
        label="日期"
        className={classes.textField}
        value={values.date}
        onChange={handleChange('date')}
        margin="normal"
      />
      <TextField
        id="standard-select-currency"
        select
        label="Select"
        className={classes.textField}
        value={values.currencyType}
        onChange={handleChange('currencyType')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        helperText="Please select your currency"
        margin="normal"
      >
        {currencies.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button 
     variant="contained" 
     color="primary" 
     className={classes.button}
     onClick={()=>getRate({variables:{currencyType:values.currencyType,date:values.date}})}
     >
        提交
        {loading && <Loading />}
      </Button>
    </form>
    <Divider />
   {(data && data.getRate) && <div>{data.getRate}</div>}
    </div>
  );
}