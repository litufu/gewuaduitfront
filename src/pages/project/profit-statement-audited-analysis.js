import React from 'react';
import ReportAnalysis from './report-analysis'


export default function ProfitStatementAuditedAnalysis(props) {

    return(
        <ReportAnalysis
        projectId={props.projectId}
        statement="利润表"
        audit="已审"
        />
    )
}