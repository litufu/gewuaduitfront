import React from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { dateToString } from '../utils'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(2),
        height: 180,
    },
    button: {
        margin: theme.spacing(1),
    },
    control: {
        padding: theme.spacing(2),
    },
    label: {
        display: "inline"
    }
}));

export default function ProjectTable(props) {
    const classes = useStyles();
  const columns = [
    { title: '被审计单位', field: 'name',render:rowData=>(
      <Button 
      color="primary" 
      className={classes.button}
      onClick={()=>props.clickCompany(rowData.company)}
      >
          {rowData.company.name}
      </Button>
    ) },
    { title: '项目组成员', field: 'members',render:rowData=>(
      <Button 
      color="primary" 
      className={classes.button}
      onClick={()=>props.clickMembers(rowData.members)}
      >
          {rowData.members.length}
      </Button>
    ) },
    { title: '开始时间', field: 'startTime', render:rowData=>(
      <Button color="primary" className={classes.button} disabled>
          {dateToString(new Date(rowData.startTime))}
      </Button>
    ) },
    {
      title: '截止时间',
      field: 'endTime',
      render: rowData=>(
          <Button color="primary" className={classes.button} disabled>
              {dateToString(new Date(rowData.endTime))}
          </Button>
        ) 
    },
    {
      title: '操作',
      field: 'operate',
      render: rowData=>(
          <Button 
          variant="contained" 
          className={classes.button}
          onClick={()=>props.clickEntry(rowData)}
          >
              进入
          </Button>
        ) 
    },
  ]
  

  return (
    <MaterialTable
      title="项目列表"
      columns={columns}
      data={props.projects}
    />
  );
}