import React from 'react';
import ReportAnalysis from './report-analysis'


export default function BalanceSheetAuditedAnalysis(props) {

    return(
        <ReportAnalysis
        projectId={props.projectId}
        statement="资产负债表"
        audit="已审"
        />
    )
}