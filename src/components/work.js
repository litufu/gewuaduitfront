import React from 'react';
import { navigate } from "@reach/router"
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import WorkIcon from '@material-ui/icons/Work';


const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    homeButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

export default function Home() {
    const classes = useStyles();
    return(
        <IconButton 
          onClick={()=>navigate('/main')}
          edge="start" className={classes.homeButton} color="inherit" aria-label="home">
            <WorkIcon />
          </IconButton>
    )
}

