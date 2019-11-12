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
import { Header, Loading, MySnackbar, SelectCompany, SelectColleauge } from '../../components'

const CREATE_MERGE_PROJECT = gql`
    mutation CreateMergeProject($parentCompanyName:String!,$sonCompanyNames: [String!]!, $startTime: DateTime!,$endTime:DateTime!,$userEmails: [String]) {
        createMergeProject(parentCompanyName: $parentCompanyName, sonCompanyNames: $sonCompanyNames, startTime: $startTime,endTime:$endTime,userEmails:$userEmails) {
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
        maxWidth: 300,
    },
}));


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
    const [sonCompanyNames, setSonCompanyNames] = useState([])
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
                            setSonCompanyNames([])
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
                                {sonCompanyNames.map(companyName=>(
                                     <Typography variant="subtitle1" key={companyName}>
                                        {companyName}
                                     </Typography>
                                ))}
                            <SelectCompany
                                handleSelect={(selection) => {
                                    setSonCompanyNames([...sonCompanyNames,selection])
                                }}
                            />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.button}
                                    onClick={() =>setDisplay("period")}
                                >
                                    下一步
                                </Button>
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
                                        createMergeProject({
                                            variables: {
                                                parentCompanyName,
                                                sonCompanyNames,
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
