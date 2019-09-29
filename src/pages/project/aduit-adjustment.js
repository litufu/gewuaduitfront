import React from 'react';
import {sum } from '../../utils'
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';

function sumArray(arr,content){
    if(content==="debit"){
        const debitArr = arr.map(item=>parseFloat(item.debit))
        return sum(debitArr)
    }else if(content==="credit"){
        const creditArr = arr.map(item=>parseFloat(item.credit))
        return sum(creditArr)
    }
}

export default function MaterialTableDemo() {
  const [state, setState] = React.useState({
    columns: [
      { title: '凭证种类', field: 'vocher_type' },
      { title: '凭证编号', field: 'vocher_num' },
      { title: '分录号', field: 'subentry_num', type: 'numeric' },
      {
        title: '摘要',
        field: 'discription',
      },
      {
        title: '科目编码',
        field: 'subject_num',
      },
      {
        title: '科目名称',
        field: 'subject_name',
      },
      {
        title: '借方',
        field: 'debit',
      },
      {
        title: "贷方",
        field: 'credit',
      },
      {
        title: "辅助核算",
        field: 'auxiliary',
      },

    ],
    data: [
      { vocher_type: '记', vocher_num: '1', subentry_num: 1, discription:"摘要", subject_num:"1001",subject_name:"库存现金",debit:0.00,credit:100.00,auxiliary:"银行"},
      { vocher_type: '记', vocher_num: '1', subentry_num: 2, discription:"摘要", subject_num:"1001",subject_name:"库存现金",debit:0.00,credit:100.00,auxiliary:"银行"},
    ],
  });

  return (
      <div>
    <MaterialTable
      title="审计调整分录"
      columns={state.columns}
      data={state.data}
      options={{
        exportButton: true,
        paging: false,
      }}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data.push(newData);
              setState({ ...state, data });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data[data.indexOf(oldData)] = newData;
              setState({ ...state, data });
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data.splice(data.indexOf(oldData), 1);
              setState({ ...state, data });
            }, 600);
          }),
      }}
    />
    <div>
    <Typography variant="h6" gutterBottom>
    {`借方合计数${sumArray(state.data,"debit")},贷方合计数${sumArray(state.data,"credit")}`}
    </Typography>
    
    </div>
    </div>
  );
}