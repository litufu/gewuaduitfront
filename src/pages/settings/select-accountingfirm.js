import React,{useState} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Downshift from 'downshift';
import {useQuery,useMutation  } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { Loading,MySnackbar} from '../../components';


export const GET_ACCOUNTING_FIRMS = gql`
  query AccountingFirms($inputvalue: String!) {
    accountingFirms(inputvalue: $inputvalue){
      id
      name
    }
  }
`;

export const CONTACT_TO_ACCOUNTINGFIRM = gql`
  mutation ContactToAccountingFirm($accountingFirmName: String!) {
    contactToAccountingFirm(accountingFirmName: $accountingFirmName){
      id
      accountingFirm{
        id
        name
      }
    }
  }
`;


export const GET_ME = gql`
  query Me {
    me{
      id
      accountingFirm{
        id
        name
      }
    }
  }
`;


function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

renderInput.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  InputProps: PropTypes.object,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 100,
    width:500,
    margin: theme.spacing(3),
    alignItems: 'center',
  },
  root1: {
    flexGrow: 1,
    height: 100,
    width:500,
    margin: theme.spacing(3),
    alignItems: 'center',
    display:"flex"
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  textField: {
    width:500
  },
  button: {
    padding: 10,
    // margin: theme.spacing(1),
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,

  },
  divider: {
    height: theme.spacing(2),
    width:500
  },
}));


function GetAccountingfirms({ inputValue,getItemProps,highlightedIndex,selectedItem }) {
  const { loading, error, data } = useQuery(GET_ACCOUNTING_FIRMS,{
    variables: { inputvalue:inputValue },
  });
  

  if (loading) return <MenuItem disabled>Loading...</MenuItem>;
  if (error) return <MenuItem disabled>Error! ${error.message}</MenuItem>;

  return data.accountingFirms.map(({name: item}, index) => (
    <MenuItem
      key={item}
      selected={highlightedIndex === index}
      component="div"
      style={{
        fontWeight: ((selectedItem || '').indexOf(item) > -1) ? 500 : 400,
      }}
      {...getItemProps({
        item,
        index,
        isActive: highlightedIndex === index,
        isSelected: selectedItem === item,
      })}
    >
      {item}
    </MenuItem>
  ));
}


export default function SelectAccountingFirm() {
  const classes = useStyles();
  const [edit,setEdit] = useState(false)
  const [contactToAccountingFirm] = useMutation(CONTACT_TO_ACCOUNTINGFIRM);
  const { loading, error, data } = useQuery(GET_ME);
  if(loading) return <Loading />
  if(error) return <MySnackbar message={"获取个人信息失败"} />
 
  if(!edit ){
    return(
    <div  className={classes.root1}>
      <TextField
        disabled
        id="standard-disabled"
        label="你所在的会计师事务所"
        className={classes.textField}
        value={data.me.accountingFirm ? data.me.accountingFirm.name :""}
        margin="normal"
      />
      <Button color="primary" className={classes.button} onClick={()=>setEdit(true)}>
        {data.me.accountingFirm ? "修改" :"添加"}
      </Button>
    </div >)
  }


  return (
    <div className={classes.root}>
      
      <Downshift 
      onChange={selection => {
        contactToAccountingFirm({ variables: { accountingFirmName: selection } })
        setEdit(false)
      }}
      id="downshift-simple">
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        }) => {
          const { onBlur, onFocus, ...inputProps } = getInputProps({
            placeholder: '输入你所在的会计师事务所',
          });

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                label: '会计师事务所',
                InputLabelProps: getLabelProps({ shrink: true }),
                InputProps: { onBlur, onFocus},
                inputProps,
              })}

              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    <GetAccountingfirms
                      inputValue={inputValue}
                      getItemProps={getItemProps}
                      highlightedIndex={highlightedIndex}
                      selectedItem={selectedItem}
                    />
                  </Paper>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
      <div className={classes.divider} />
    </div>
  );
}