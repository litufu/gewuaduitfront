import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Holders from './holders'
import { dateToString } from '../utils'


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));


export default function Company(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem>
          <ListItemText primary={`公司名称:${props.company.name}`} />
        </ListItem>
        {
            props.company.code && (
                <ListItem>
                    <ListItemText primary={`统一社会信用代码:${props.company.code}`} />
                </ListItem>
            )
        }
        {
            props.company.address && (
                <ListItem>
                    <ListItemText primary={`地址:${props.company.address}`} />
                </ListItem>
            )
        }
        {
            props.company.legalRepresentative && (
                <ListItem>
                    <ListItemText primary={`法定代表人:${props.company.legalRepresentative}`} />
                </ListItem>
            )
        }
        {
            props.company.establishDate && (
                <ListItem>
                    <ListItemText primary={`成立日期:${dateToString(new Date(props.company.establishDate))}`} />
                </ListItem>
            )
        }
        {
            props.company.registeredCapital && (
                <ListItem>
                    <ListItemText primary={`注册资本:${props.company.registeredCapital}`} />
                </ListItem>
            )
        }
            {
            props.company.paidinCapital && (
                <ListItem>
                    <ListItemText primary={`实收资本:${props.company.paidinCapital}`} />
                </ListItem>
            )
        }
            {
            props.company.businessScope && (
                <ListItem>
                    <ListItemText primary={`经营范围:${props.company.businessScope}`} />
                </ListItem>
            )
        }
        {
            props.company.holders.length>0 && (
                    <Holders holders={props.company.holders} />
            )
        }
      </List>
    </div>
  );
}