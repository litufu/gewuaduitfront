import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Loading,ProjectHeader} from '../../../components';
import { navigate } from "@reach/router"
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const AGE_SETTING = gql`
  mutation AgeSetting($projectId: String!,$years:Int!,$months:Int!,$oneYear:Boolean!) {
    ageSetting(projectId: $projectId,years:$years,months:$months,oneYear:$oneYear) 
  }
`;

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
    button: {
        margin: theme.spacing(1),
      },
  }));

  const selectMonths = [
     {
        value: 3,
        label: '3分法',
      },
      {
        value: 4,
        label: '4分法',
      },
  ]

  const selectYears = [
    {
      value: 1,
      label: '1年',
    },
    {
      value: 2,
      label: '2年',
    },
    {
      value: 3,
      label: '3年',
    },
    {
        value: 4,
        label: '4年',
      },
      {
        value: 5,
        label: '5年',
      },
  ];

function range(start, end, step) {
    let arr = [];
    for(let i=start; i < end; i++){
        if(i%step===0){arr.push(i)}
    }
    return arr;
}

export default function AgeSetting(props) {
  const classes = useStyles();
  const [oneYear, setOneYear] = React.useState(true);
  const [months,setMonths] = React.useState(4)
  const [years,setYears] = React.useState(3)
  const [
    ageSetting,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(AGE_SETTING,{
    onCompleted({ ageSetting }) {
          if(ageSetting){
              alert("设置账龄成功")
          }else{
            alert("设置账龄失败")
          }
    }
  });

  return (
    <div>
        <ProjectHeader
    onClick={()=>navigate(`/project/${props.projectId}`)}
    title="设置账龄区间"
   />
      <TextField
        id="standard-select-currency"
        select
        label="是否设置一年以内账龄"
        className={classes.textField}
        value={oneYear}
        onChange={(event)=>setOneYear(event.target.value)}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        margin="normal"
      >
          <MenuItem value={true}>
            是
          </MenuItem>
          <MenuItem value={false}>
            否
          </MenuItem>
      </TextField>
      <div>
     <TextField
        id="standard-select-currency"
        select
        label="年数划分"
        className={classes.textField}
        value={years}
        onChange={(event)=>setYears(event.target.value)}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        margin="normal"
      >
        {selectYears.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <List>
        {range(0,years,1).map(
            year=>(<ListItem>
                    {year}年-{year+1}年
                </ListItem>
                )
        )
        
            }
            {years>0 && (<ListItem>
            {years}年以上
            </ListItem>)}
      </List>
      </div>
      <Divider />
      {
          oneYear && (<div>
            <TextField
               id="standard-select-currency"
               select
               label="一年以内月数划分"
               className={classes.textField}
               value={months}
               onChange={(event)=>setMonths(event.target.value)}
               SelectProps={{
                 MenuProps: {
                   className: classes.menu,
                 },
               }}
               margin="normal"
             >
               {selectMonths.map(option => (
                 <MenuItem key={option.value} value={option.value}>
                   {option.label}
                 </MenuItem>
               ))}
             </TextField>
             {
                 months === 3 && (
                <List
                    subheader={
                   <ListSubheader component="div" id="nested-list-subheader">
                       3分法
                   </ListSubheader>
               }
             >
                   <ListItem>3个月以内</ListItem>
                   <ListItem>3-6个月</ListItem>
                   <ListItem>6-12个月</ListItem>
                </List>
                 )
             }
             
             {
                 months===4 && (<List
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            4分法
                        </ListSubheader>
                    }
                  >
                        <ListItem>1个月以内</ListItem>
                        <ListItem>1-3个月</ListItem>
                        <ListItem>3-6个月</ListItem>
                        <ListItem>6-12个月</ListItem>
                  </List>)
             }
             </div>)
      }
       <Button
       onClick={()=>{ageSetting({variables:{projectId:props.projectId,years:years,months:months,oneYear:oneYear}})}} 
       variant="contained" className={classes.button}>
            提交
        </Button>
        {mutationLoading && <Loading />}
        {mutationError && <div>{mutationError.message}</div>}
     </div>
  );
}