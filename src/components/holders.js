import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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

export default function Holders(props) {
  const classes = useStyles();

  return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>股东名称</TableCell>
            <TableCell align="right">持股比例</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.holders.map(holder => (
            <TableRow key={holder.id}>
              <TableCell component="th" scope="row">
                {holder.name}
              </TableCell>
              <TableCell align="right">{holder.ratio}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}