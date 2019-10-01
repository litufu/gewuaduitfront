import React,{useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import  Loading from './loading';


const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    dense: {
      marginTop: theme.spacing(2),
    },
    menu: {
      width: 200,
    },
  }));

const GET_AUXILIARY_NAMES = gql`
    query GetAuxiliaryNames($projectId: String!) {
      getAuxiliaryNames(projectId: $projectId) 
  }
`

SimpleDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selectedValue: PropTypes.string
};

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue,projectId, ...other } = props;
  const [search,setSearch] = useState("")
  const { loading, error, data } = useQuery(GET_AUXILIARY_NAMES, {
    variables: { projectId},
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>

  const auxiliaries = JSON.parse(data.getAuxiliaryNames)

  function handleClose() {
    onClose(selectedValue);
  }

  function handleListItemClick(value) {
    onClose(value);
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      {...other}
    >
      <DialogTitle id="simple-dialog-title">选择辅助核算科目</DialogTitle>
      <TextField
        id="outlined-name"
        label="搜索辅助核算科目"
        className={classes.textField}
        value={search}
        onChange={(event)=>setSearch(event.target.value)}
        margin="normal"
        variant="outlined"
      />
      <List>
        {auxiliaries.map(auxiliary=>
        `${auxiliary.type_name}_${auxiliary.name}`
        ).filter(auxiliaryStr=>auxiliaryStr.indexOf(search) !== -1).map(auxiliaryStr => {
          return(<ListItem button onClick={() => handleListItemClick(auxiliaryStr)} key={auxiliaryStr}>
            <ListItemText primary={auxiliaryStr}/>
          </ListItem>)
        })}
        </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onChange: PropTypes.func
};

export default function SelectIconDialog(props) {
  const { value, onChange,projectId } = props;
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div>
      <Button  color="primary" onClick={handleClickOpen}>
      {selectedValue?selectedValue:"选择"}
      </Button>
      <SimpleDialog
        projectId={projectId}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
