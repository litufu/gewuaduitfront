import React, { useRef } from 'react';
import gql from 'graphql-tag';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ReactToPrint from 'react-to-print';
import {dateToStringHan, fmoney} from '../../utils'
import {useQuery,useMutation } from '@apollo/react-hooks';
import { Loading,MySnackbar,Header} from '../../components';

export const GET_ACCOUNTINGFIRM = gql`
  query accountingFirm {
    accountingFirm{
      id
      name
      email
      code
      address
      phone
      zipCode
      fax
      returnAddress
      returnPhone
      returnPerson
    }
  }
`;

function getTitle(subjectName){
    if(subjectName==="应收账款"){
        return ["贵公司欠","本期销售额"]
    }else if(subjectName==="预收款项"){
        return ["欠贵公司","本期销售额"]
    }else if(subjectName==="应付账款"){
        return ["欠贵公司","本期采购额"]
    }else if(subjectName==="预付款项"){
        return ["贵公司欠","本期采购额"]
    }else if(subjectName==="其他应收款"){
        return ["贵公司欠","欠贵公司"]
    }else if(subjectName==="其他应付款"){
        return ["欠贵公司","贵公司欠"]
    }else{
        return ["贵公司欠","欠贵公司"]
    }
}

class ComponentToPrint extends React.Component {
    render() {
      return (
        <div style={{padding:3}}>
          <div style={{textAlign:"center",margin: 5,}}>
              <Typography variant="h6" >
                    企业询证函
                  </Typography>
              </div>
              <div style={{margin: 2}}>
                {`${this.props.currentData.name}`}：
              </div>
              <div >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本公司聘请的{`${this.props.accountingFirm.name}`}正在对本公司{`${dateToStringHan(new Date(this.props.project.startTime))}`}至{`${dateToStringHan(new Date(this.props.project.endTime))}`}财务报表进行审计，按照中国注册会计师审计准则的要求，应当询证本公司与贵公司的往来账项等事项。下列信息出自本公司账簿记录，如与贵公司记录相符，请在本函下端“信息证明无误”处签章证明；如有不符，请在“信息不符”处列明不符项目。如存在与本公司有关的未列入本函的其他项目，也请在“信息不符”处列出这些项目的金额及详细资料。回函请直接寄至{`${this.props.accountingFirm.name}`}。
              </div>
              <div >
              {`回函地址：${this.props.accountingFirm.returnAddress}`}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {`邮编：${this.props.accountingFirm.zipCode}`}
              </div>
              <div>
              {`电话:${this.props.accountingFirm.returnPhone}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`传真：${this.props.accountingFirm.returnPhone}`} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   {`联系人:${this.props.accountingFirm.returnPerson}`}
              </div>
              <div >
              1．本公司与贵公司的往来账项列示如下：
              </div>
              <div style={{textAlign:"right",marginRight:5}}>
                单位：元
                </div>
              <div >
              <Table  aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>截止日期</TableCell>
                    <TableCell align="right">
                    {getTitle(this.props.currentData.subjectName)[0]}
                    </TableCell>
                    <TableCell align="right">
                    {getTitle(this.props.currentData.subjectName)[1]}
                    </TableCell>
                    <TableCell align="right">备注</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {dateToStringHan(new Date(this.props.project.endTime))}
                      </TableCell>
                      <TableCell align="right">
                          {fmoney(this.props.currentData.sendBalance,2)}
                      </TableCell>
                      <TableCell align="right">
                        {fmoney(this.props.currentData.sendAmount,2)}
                      </TableCell>
                      <TableCell align="right">我公司记录为{`${this.props.currentData.subjectName}`}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
              </div>
              <div>
                2．其他事项。
              </div>
              <div>
              <textarea style={{width:"100%",height:80}}></textarea>
              </div>
              <div>
              本函仅为复核账目之用，并非催款结算。若款项在上述日期之后已经付清，仍请及时函复为盼。
              </div>
              <div style={{textAlign:"right",marginTop:50,marginRight:15,marginBottom:50}}>
                {`${this.props.project.company.name}`}(盖章)
              </div>
              <div>
                结论：
              </div>
              <div>
              <Grid container item justify="center"  xs={12} >
                <Grid item xs={6} style={{borderWidth:1,borderStyle:"solid" }}>
                  <div>1. 信息证明无误。</div>
                  <div style={{marginTop:80,marginRight:100,textAlign:"right"}}>
                    （被询证单位盖章）
                    </div>
                  <div
                  style={{marginTop:5,paddingRight:120,textAlign:"right"}}
                  >年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                  <div
                  style={{marginTop:5,paddingRight:150,textAlign:"right"}}
                  >经办人:</div>
                </Grid>
                <Grid item  xs={6} style={{borderWidth:1,borderStyle:"solid" }}>
                  <div>2．信息不符，请列明不符项目及具体内容。</div>
                  <div style={{marginTop:80,paddingRight:100,textAlign:"right"}}>
                    （被询证单位盖章）
                    </div>
                  <div
                  style={{marginTop:5,paddingRight:120,textAlign:"right"}}
                  >年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                  <div
                  style={{marginTop:5,paddingRight:150,textAlign:"right"}}
                  >经办人:</div>
                </Grid>
              </Grid>
              </div>
          </div>
      );
    }
  }
   
  const PrintLetterOfProof = (props) => {
    const componentRef = useRef();
    const { loading, error, data } = useQuery(GET_ACCOUNTINGFIRM,{
        fetchPolicy:"network-only"
      });
      if(loading) return <Loading />
      if(error) return <div>{error.message}</div>
    return (
      <div>
        <ReactToPrint
          trigger={() => <button style={{color:"blue"}}>打印</button>}
          content={() => componentRef.current}
        />
        <ComponentToPrint
        accountingFirm={data.accountingFirm}
        currentData={props.currentData}
        project={props.project}
         ref={componentRef} />
      </div>
    );
  };

  export default PrintLetterOfProof