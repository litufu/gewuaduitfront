import React from 'react';
import { navigate } from "@reach/router"
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';


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
          onClick={()=>navigate('/')}
          edge="start" className={classes.homeButton} color="inherit" aria-label="home">
            <HomeIcon />
          </IconButton>
    )
}

