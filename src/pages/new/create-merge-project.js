import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { Header, Loading, MySnackbar, SelectCompany, SelectColleauge } from '../../components'

const CREATE_MERGE_PROJECT = gql`
    mutation CreateMergeProject($parentCompanyName:String!,$sonCompanys: [SonCompanyInput!]!, $startTime: DateTime!,$endTime:DateTime!,$userEmails: [String]) {
        createMergeProject(parentCompanyName: $parentCompanyName, sonCompanys: $sonCompanys, startTime: $startTime,endTime:$endTime,userEmails:$userEmails) {
            id
        }
    }
`


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: "column",
        alignItems: "center"
    },
    period: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center"
    },
    add: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: "column",
        alignItems: "center"
    },
    table: {
        minWidth: 650,
    },
    upload: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center"
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 500,
    },
    datetField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    button: {
        margin: theme.spacing(2),
        width:200,
        maxWidth: 300,
    },
}));

const sonTypes = [
    {
      value: '合并',
      label: '合并',
    },
    {
      value: '单体',
      label: '单体',
    },
  ];

export default function CreateMergeProject() {
    const classes = useStyles();
    const displayTexts = {
        "parent": "1.选择母公司",
        "son": "2.选择子公司",
        "period": "3.选择项目起止日期",
        "add": "4.添加项目组成员",
        "success": "5.项目创建完成",
    }
    
    const [parentCompanyName, setParentCompanyName] = useState("")
    const [sonCompanys, setSonCompanys] = useState([])
    const [sonType,setSonType] = useState("")
    const [sonCompanyName,setSonCompanyName] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [display, setDisplay] = useState("parent")
    const [userEmails, setUserEmails] = useState([])
    const [colleagueEmail, setColleagueEmail] = useState("")
    const [createMergeProject, { loading: addLoading, error: addError }] = useMutation(
        CREATE_MERGE_PROJECT,
        {
            onCompleted({ createMergeProject }) {
                setDisplay("success")
            }
        }
    );

    if (addLoading) return <Loading />;

    return (
        <Container component="main" maxWidth="xs">
            <Header />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    创建集团项目
                </Typography>
                <Typography variant="subtitle1">
                    {displayTexts[display]}
                </Typography>
                {
                    (display === "success") && (<Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                            setDisplay("parent")
                            setUserEmails([])
                            setSonCompanys([])
                        }}
                    >
                        继续创建
                            </Button>)
                }

                <form className={classes.container} noValidate autoComplete="off">
                    {
                        display === "parent" && (
                            <SelectCompany
                                handleSelect={(selection) => {
                                    setParentCompanyName(selection)
                                    setDisplay("son")
                                }}
                            />
                        )
                    }
                     {
                        display === "son" && (
                            <div>
                                <Typography variant="h6">
                                    子公司列表
                                </Typography>
                                {sonCompanys.map(company=>(
                                    <Button 
                                    key={company.sonCompanyName}
                                    onClick={()=>{
                                        const newSonCompanys = sonCompanys.filter(c=>c.sonCompanyName!==company.sonCompanyName)
                                        setSonCompanys(newSonCompanys)
                                    }}>
                                     <Typography variant="subtitle1">
                                       {`${company.sonCompanyName}-${company.sonType}`} 
                                     </Typography>
                                     </Button>
                                ))}
                                <TextField
                                id="standard-select-currency"
                                select
                                label="公司项目类型"
                                className={classes.textField}
                                value={sonType}
                                onChange={event=>setSonType(event.target.value)}
                                SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                                }}
                                helperText="选择合并，请确保公司已经作为母公司建立了合并项目"
                                margin="normal"
                            >
                                {sonTypes.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                                ))}
                            </TextField>
                            <SelectCompany
                                handleSelect={(selection) => {
                                    setSonCompanyName(selection)
                                }}
                            />
                            <Grid container justify="center">
                            <Grid item xs={6}>
                            <Button
                                    variant="contained"
                                    className={classes.button}
                                    onClick={() =>{
                                        if(sonCompanyName===""){
                                            alert("请输入公司名称")
                                            return
                                        }
                                        if(sonType===""){
                                            alert("请输入公司类型")
                                            return
                                        }
                                        setSonType("")
                                        setSonCompanyName("")
                                        setSonCompanys([...sonCompanys,{sonCompanyName,sonType}])
                                    }}
                                >
                                    添加
                                </Button>
                            </Grid>
                             <Grid item xs={6}>
                             <Button
                                    variant="contained"
                                    className={classes.button}
                                    onClick={() =>setDisplay("period")}
                                >
                                    下一步
                                </Button>
                             </Grid>
                             </Grid>
                                
                            </div>
                        )
                    }
                    {
                        display === "period" && (
                            <div>
                                <div className={classes.period}>
                                    <TextField
                                        id="date1"
                                        label="起始日期"
                                        type="date"
                                        className={classes.datetField}
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <Typography variant="body1">
                                        至
                                    </Typography>
                                    <TextField
                                        id="date2"
                                        label="截止日期"
                                        type="date"
                                        className={classes.datetField}
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                </div>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.button}
                                    onClick={() => {
                                        const startTimeDate = new Date(startTime)
                                        if (startTimeDate.getDate() !== 1 && startTimeDate.getMonth() !== 0) {
                                            alert("日期设置错误,仅支持1月1日开上传")
                                        } else {
                                            setDisplay("add")
                                        }
                                    }
                                    }
                                >
                                    下一步
                                </Button>
                            </div>
                        )
                    }
                    {
                        display === "add" && (
                            <div className={classes.add}>
                                <Grid container spacing={3} >
                                    <Grid item xs={12}>
                                        <Paper>
                                            <SelectColleauge
                                                handleSelect={(selection) => {
                                                    setColleagueEmail(selection)
                                                }}
                                            />
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                className={classes.button}
                                                onClick={
                                                    () => {
                                                        setUserEmails([...userEmails, colleagueEmail])
                                                        setColleagueEmail("")
                                                    }
                                                }
                                            >
                                                添加
                                    </Button>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12}>
                                    <Typography variant="h6">
                                        权限人列表
                                    </Typography>
                                        {
                                            userEmails.map(email=>(
                                                <Typography variant="subtitle1" key={email}>
                                                    {email}
                                                </Typography>
                                            ))
                                        }
                                    </Grid>
                                </Grid>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.button}
                                    onClick={() => {
                                        console.log(parentCompanyName)
                                        console.log(sonCompanys)
                                        console.log(startTime)
                                        console.log(endTime)
                                        console.log(userEmails)
                                        createMergeProject({
                                            variables: {
                                                parentCompanyName,
                                                sonCompanys,
                                                startTime: new Date(startTime),
                                                endTime: new Date(endTime),
                                                userEmails,
                                            }
                                        })
                                    }}
                                >
                                    创建合并项目
                                        </Button>
                            </div>
                        )
                    }
                </form>
                {
                    addError && (<MySnackbar message={`数据上传失败${addError.message}`} />)
                }
            </div>
        </Container>
    );
}
