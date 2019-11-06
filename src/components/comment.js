import React from 'react';
import gql from 'graphql-tag';
import {useQuery,useMutation } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Loading,Header} from '../components';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';

export const GET_COMMENTS = gql`
  query comments {
    comments{
      id
      title
      email
      content
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($title:String!,$email:String,$content:String!) {
    addComment(title:$title,email:$email,content:$content) {
      id
      title
      email
      content
    }
  }
`;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    textAlign:"center",
    width:800,
    marginLeft:100,
  },
  comment:{
    textAlign:"center",
    marginTop:10,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width:700,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  paper:{
    width:800,
    textAlign:"center",
  },
  button:{
    margin: theme.spacing(1),
    width:700,
  }
}));


export default function Comment() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    title: '',
    content: '',
    email: '',
  });

  const { loading, error, data } = useQuery(GET_COMMENTS);
  const [
    addComment,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(ADD_COMMENT,{
    onCompleted({ addComment }) {
      setValues({
        title: '',
        email: '',
        content: '',
      });
  },
    update(cache, { data: { addComment } }) {
      const { comments } = cache.readQuery({ query: GET_COMMENTS });
        cache.writeQuery({
          query: GET_COMMENTS,
          data: { comments: [addComment,...comments] },
        });
      }
  });
  if(loading||mutationLoading) return <Loading />
  if(error) return <div>{error.message}</div>
  if(mutationError) return <div>{mutationError.message}</div>

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <Grid className={classes.container}>
      <Grid item xs={12}>
      <Paper className={classes.paper}>
      <TextField
        id="standard-name"
        label="标题"
        className={classes.textField}
        value={values.title}
        onChange={handleChange('title')}
        margin="normal"
        helperText="需求、建议或评论的标题"
      />
      <TextField
        id="standard-name"
        label="邮箱"
        className={classes.textField}
        value={values.email}
        onChange={handleChange('email')}
        margin="normal"
        helperText="留下邮箱，让我们可以联系到你"
      />
      <TextField
        id="standard-textarea"
        label="内容"
        multiline
        onChange={handleChange('content')}
        value={values.content}
        className={classes.textField}
        margin="normal"
        helperText="需求、建议或评论的具体内容"
      />
      <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={()=>addComment({ variables: { title: values.title,content:values.content,email:values.email } })}
      >
        提交
      </Button>
      </Paper>
     
      </Grid>
    <Grid item xs={12} className={classes.comment}>
    <List>
        {data.comments.map(comment=>(
          <React.Fragment>
          <ListItem key={comment.id}>
          <ListItemText
            primary={comment.title}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {comment.email && `${comment.email.slice(0,1)}***${comment.email.slice(-1,)} :   `}
                </Typography>
                {comment.content}
              </React.Fragment>
            }
          />
          </ListItem>
          <Divider  />
          </React.Fragment>
        ))}
      </List>
      
    </Grid>
    </Grid>
  );
}