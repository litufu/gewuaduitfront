import React from 'react';
import _ from 'lodash'
import gql from 'graphql-tag';
import {useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Loading } from '../components';
import {
    Player,
  } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export const GET_VEDIOS = gql`
  query vedios {
    vedios{
      id
      title
      url
      poster
    }
  }
`;

export default function PlayVideo() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_VEDIOS);
  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          {_.orderBy(data.vedios,['no'], ['asc']).map(vedio=>(
               <Grid item xs={4}>
               <Player>
                   <source src={vedio.url} />
               </Player>
               <div>{vedio.title}</div>
               </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
