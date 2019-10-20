import React, { Fragment } from 'react';
import { Router } from '@reach/router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Container from '@material-ui/core/Container';
import Main from './main';
import Profile from './profile';
import CreateCustomer from './new/create-customer'
import Signin from './auth/signin'
import ResetPassword from './auth/reset-password';
import ValidateEmail from './auth/validate-email';
import ForgetPassword from './auth/forget-password'
import WaitForEmailValidated from './auth/wait-for-validate-email'
import Sendforgetpasswordemailsuccess from './auth/send-forget-password-email-success'
import Signup from './auth/signup'
import Settings from './settings';
import UploadData from './new/upload-data'
import CreateProject from './new/create-project'
import Project from './project'
import CheckImportData from './project/check-import-data'
import SujbectBalance from './project/subject-balance';
import ChronologicalAccount from './project/chronological-account'
import TB from './project/tb'
import AduitAdjustment from './project/aduit-adjustment'
import AddSubject from './project/add-subject'
import AddAuxiliary from './project/add-auxiliary'
import StdSubject from './project/std-subject'
import Auxiliary from './project/auxiliary'
import CheckProfitAndLossCarryOver from './project/check-profit-and-loss-carry-over'
import BalanceSheetAuditedAnalysis from './project/balance-sheet-audited-analysis'
import BalanceSheetUnAuditedAnalysis from './project/balance-sheet-unAudited-analysis'
import ProfitStatementAuditedAnalysis from './project/profit-statement-audited-analysis'
import ProfitStatementUnAuditedAnalysis from './project/profit-statement-unAudited-analysis'
import Importance from './project/importance'
import IdentifiedRisks from './project/identified-risks'
import ImportantAccount from './project/important-account'
import EntryClassify from './project/entry-classify'
import EntryList from './project/entry-list'
import CheckEntry from './project/check-entry'
import Supplier from './project/supplier'
import Customer from './project/customer'
import AgeSetting from './project/age-setting'
import CustomerIsSupplier from './project/customer-is-supplier'
import Entry from '../components/entry'



const IS_LOGGEDIN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

const HAS_EMAILVALIDATED = gql`
query EmailValidated {
  emailValidated @client
}
`;

export default function App() {

function PagesPart(){
    return(
      <Router primary={false} component={Fragment}>
        <Main path="/main" />
        <ValidateEmail path="validateEmail" />
        <Settings path="settings" />
        <Profile path="profile"/>
        <CreateCustomer path="createcustomer" />
        <UploadData path="uploaddata" />
        <CreateProject path="createproject" />
        <Project path="project/:projectId" />
        <CheckImportData path="checkProject/:projectId" />
        <SujbectBalance path="getSubjectBalcance/:projectId" />
        <ChronologicalAccount path="chronologicalAccount" />
        <TB path="tb/:projectId" />
        <AduitAdjustment path="adjustment/:projectId" />
        <Entry path="entry/:projectId" />
        <AddSubject path="addSubject/:projectId" />
        <AddAuxiliary path="addAuxiliary/:projectId" />
        <StdSubject path="stdSubject/:projectId" />
        <Auxiliary path="auxiliary/:projectId" />
        <CheckProfitAndLossCarryOver  path="checkProfitAndLossCarryOver/:projectId" />
        <BalanceSheetAuditedAnalysis path="balanceSheetAudited/:projectId" />
        <BalanceSheetUnAuditedAnalysis path="balanceSheetUnAudited/:projectId" />
        <ProfitStatementAuditedAnalysis path="profitStatementAudited/:projectId" />
        <ProfitStatementUnAuditedAnalysis path="profitStatementUnAudited/:projectId" />
        <Importance path="importance/:projectId" />
        <IdentifiedRisks path="identifiedRisks/:projectId" />
        <ImportantAccount path="importantAccount/:projectId" />
        <EntryClassify path="entryClassify/:projectId" />
        <CheckEntry path="checkEntry/:projectId" />
        <EntryList path="entryList" />
        <Supplier path="supplier/:projectId" />
        <Customer path="customer/:projectId" />
        <AgeSetting path="ageSetting/:projectId" />
        <CustomerIsSupplier path="customerIsSupplier/:projectId" />
        <Main default />
      </Router> 
    )
}

function LoginPart(){
  return (
    <Router primary={false} component={Fragment}>
      <Signin path="/signin" />
      <Signup path="signup" />
      <ResetPassword path="resetPassword" />
      <ValidateEmail path="validateEmail" />
      <ForgetPassword path="forgetPassword" />
      <WaitForEmailValidated path="waitForEmailValidated" />
      <Sendforgetpasswordemailsuccess path="sendforgetpasswordemailsuccess" />
      <Signin default />
    </Router>
  )
}


function HasLoginPart(){
  return (
    <Router primary={false} component={Fragment}>
      <ResetPassword path="resetPassword" />
      <ValidateEmail path="validateEmail" />
      <ForgetPassword path="forgetPassword" />
      <WaitForEmailValidated path="waitForEmailValidated" />
      <Sendforgetpasswordemailsuccess path="sendforgetpasswordemailsuccess" />
      <WaitForEmailValidated default />
    </Router>
  )
}



  function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGEDIN)
    const { data:myData } = useQuery(HAS_EMAILVALIDATED)
    if(data.isLoggedIn && myData.emailValidated){
      return <PagesPart />
    }else if(data.isLoggedIn && !myData.emailValidated){
      return <HasLoginPart />
    }else{
      return <LoginPart />
    }
    
  }

  return (
    <Fragment>
      <Container>
        <IsLoggedIn />
      </Container>
    </Fragment>
  );
}