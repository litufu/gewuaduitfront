import React, { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MaterialTable from "material-table";
import Grid from '@material-ui/core/Grid';
import { Header, Loading, MySnackbar, SelectCompany, SelectColleauge, MySelect } from '../../components'
import { roles, roleMatch, roleMatchReverse } from '../../constant'

const CREATE_PROJECT = gql`
    mutation CreateProject($members: [MemberInput!]!, $companyName: String!, $startTime: DateTime!,$endTime:DateTime!) {
        createProject(members: $members, companyName: $companyName, startTime: $startTime,endTime:$endTime) {
            id
        }
    }
`

const GET_DATA_RECORD = gql`
    query DataRecord($companyName: String!, $startTime: DateTime!,$endTime:DateTime!) {
        dataRecord(companyName: $companyName, startTime: $startTime,endTime:$endTime) {
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


export default function CreateProject() {
    const classes = useStyles();
    const client = useApolloClient();
    const displayTexts = {
        "company": "1.选择公司",
        "period": "2.选择项目起止日期",
        "add": "3.添加项目组成员",
        "success": "4.项目创建完成",
    }
    
    const [companyName, setCompanyName] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [display, setDisplay] = useState("company")
    const [members, setMembers] = useState([])
    const [colleagueEmail, setColleagueEmail] = useState("")
    const [role, setRole] = useState("")
    const [createProject, { loading: addLoading, error: addError }] = useMutation(
        CREATE_PROJECT,
        {
            onCompleted({ createProject }) {
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
                    创建项目
                </Typography>
                <Typography variant="subtitle1">
                    {displayTexts[display]}
                </Typography>
                {
                    (display === "success") && (<Button
                        variant="text"
                        color="primary"
                        onClick={() => setDisplay("company")}
                    >
                        继续创建
                            </Button>)
                }

                <form className={classes.container} noValidate autoComplete="off">
                    {
                        display === "company" && (
                            <SelectCompany
                                handleSelect={(selection) => {
                                    setCompanyName(selection)
                                    setDisplay("period")
                                }}
                            />
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
                                            client.query({
                                                query: GET_DATA_RECORD,
                                                variables: {
                                                    companyName,
                                                    startTime: new Date(startTime),
                                                    endTime: new Date(endTime),
                                                }
                                            }).then(({ data }) => {
                                                if (data && data.dataRecord) {
                                                    setDisplay("add")
                                                }
                                            }).catch((error) => {
                                                alert("请确认已上传该公司该期间数据，并且你已被授权访问")
                                            })
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
                                            <MySelect
                                                objects={roles}
                                                value={role}
                                                lable="项目角色"
                                                onChange={event => setRole(event.target.value)}
                                            />
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
                                                        setMembers([...members, { "email": colleagueEmail, "role": roleMatch[role] }])
                                                        setRole("")
                                                        setColleagueEmail("")
                                                    }
                                                }
                                            >
                                                添加
                                    </Button>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MaterialTable
                                            columns={[
                                                { title: "成员", field: "email" },
                                                { title: "角色", field: "role" },
                                            ]}
                                            data={members}
                                            actions={[
                                                {
                                                    icon: 'delete',
                                                    tooltip: '删除项目组成员',
                                                    onClick: (event, rowData) => setMembers(members.filter(mem => mem.email !== rowData.email))
                                                }
                                            ]}
                                            title="项目组成员"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.button}
                                    onClick={() => {
                                        const newMembers = members.map(member => ({
                                            "email": member.email,
                                            "role": roleMatchReverse[member.role]
                                        }))
                                        createProject({
                                            variables: {
                                                companyName,
                                                members: newMembers,
                                                startTime: new Date(startTime),
                                                endTime: new Date(endTime),
                                            }
                                        })
                                    }}
                                >
                                    创建项目
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
