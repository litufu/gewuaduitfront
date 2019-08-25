import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
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

export default function ProjectListItem(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.root} spacing={2}>
            <Paper className={classes.paper}>
                <Grid item container justify="flex-start"  >
                    <Grid item xs={12} container justify="flex-start">
                    <Grid item xs={6}>
                        <Typography className={classes.label}>被审计单位:</Typography>
                        <Button 
                        color="primary" 
                        className={classes.button}
                        onClick={()=>props.clickCompany(props.project.company)}
                        >
                            {props.project.company.name}
                        </Button>
                        </Grid>
                        <Grid item xs={6}>
                        <Typography className={classes.label}>项目组成员:</Typography>
                        <Button 
                        color="primary" 
                        className={classes.button}
                        onClick={()=>props.clickMembers(props.project.members)}
                        >
                            {props.project.members.length}
                        </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container justify="flex-start" >
                    <Grid item xs={6}>
                        <Typography className={classes.label}>开始时间:</Typography>
                        <Button color="primary" className={classes.button} disabled>
                            {dateToString(new Date(props.project.startTime))}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.label}>截止时间:</Typography>
                        <Button color="primary" className={classes.button} disabled>
                            {dateToString(new Date(props.project.endTime))}
                        </Button>
                    </Grid>
                    </Grid>
                    <Grid  >
                        <Button 
                        variant="contained" 
                        className={classes.button}
                        onClick={()=>props.clickEntry(props.project)}
                        >
                            进入
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
}