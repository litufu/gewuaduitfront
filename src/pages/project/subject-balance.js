import React,{useState} from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { navigate } from "@reach/router"
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'

const GET_SUBJECT_BALANCE = gql`
  query GetSubjectBalance($projectId: String!) {
    getSubjectBalance(projectId: $projectId) 
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));



export default function SujbectBalance(props) {
  const classes = useStyles();
  const [grade,setGrade] = useState(1)
  const { loading, error, data } = useQuery(GET_SUBJECT_BALANCE, {
    variables: { projectId:props.projectId },
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>

  const newData = JSON.parse(data.getSubjectBalance)

  return (
    <Paper className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="科目余额表"
        />
    <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">选择显示级别</InputLabel>
        <Select
          value={grade}
          onChange={(event)=>setGrade(event.target.value)}
          inputProps={{
            name: 'age',
            id: 'age-simple',
          }}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={3}>4</MenuItem>
          <MenuItem value={3}>5</MenuItem>
          <MenuItem value={3}>6</MenuItem>
          <MenuItem value={3}>7</MenuItem>
          <MenuItem value={3}>8</MenuItem>
          <MenuItem value={3}>9</MenuItem>
          <MenuItem value={3}>10</MenuItem>
        </Select>
      </FormControl>
        
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>科目编码</TableCell>
            <TableCell align="right">科目名称</TableCell>
            <TableCell align="right">科目类型</TableCell>
            <TableCell align="right">借贷方向</TableCell>
            <TableCell align="right">是否明细</TableCell>
            <TableCell align="right">科目级别</TableCell>
            <TableCell align="right">期初余额</TableCell>
            <TableCell align="right">借方发生额</TableCell>
            <TableCell align="right">贷方发生额</TableCell>
            <TableCell align="right">期末余额</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newData.filter(row=>row.subject_gradation<=grade).map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.subject_num}
              </TableCell>
              <TableCell align="right">{row.subject_name}</TableCell>
              <TableCell align="right">{row.subject_type}</TableCell>
              <TableCell align="right">{row.direction}</TableCell>
              <TableCell align="right">{row.is_specific}</TableCell>
              <TableCell align="right">{row.subject_gradation}</TableCell>
              <TableCell align="right">{fmoney(row.initial_amount,2)}</TableCell>
              <TableCell align="right">{fmoney(row.debit_amount,2)}</TableCell>
              <TableCell align="right">{fmoney(row.credit_amount,2)}</TableCell>
              <TableCell align="right">{fmoney(row.terminal_amount,2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}