import gql from "graphql-tag";

const GET_NOT_COMPUTE_TB_SUBJECTS = gql`
    query GetNoComputeTbSubjects{
        getNoComputeTbSubjects{
          id
          show
          subject
          order
    }
}
`

export default GET_NOT_COMPUTE_TB_SUBJECTS;