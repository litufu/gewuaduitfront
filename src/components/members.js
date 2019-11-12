import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {roleMatch} from '../constant'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));


export default function Members(props) {
  const classes = useStyles();

  return (
      <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>姓名</TableCell>
            <TableCell align="right">邮箱</TableCell>
            <TableCell align="right">角色</TableCell>
          </TableRow>
        </TableHead>
        {props.type==="单体" && (
          <TableBody>
          {props.members.map(member => (
            <TableRow key={member.id}>
              <TableCell component="th" scope="row">
                {member.user.name}
              </TableCell>
              <TableCell align="right">{member.user.email}</TableCell>
              <TableCell align="right">{roleMatch[member.role]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        )}
         {props.type==="合并" && (
          <TableBody>
          {props.members.map(user => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell align="right">{user.email}</TableCell>
              <TableCell align="right">授权查看合并报表</TableCell>
            </TableRow>
          ))}
        </TableBody>
        )}
        
      </Table>
      </Paper>
  );
}