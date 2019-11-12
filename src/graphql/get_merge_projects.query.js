import gql from "graphql-tag";

const GET_MERGE_PROJECTS = gql`
    query MergeProjects{
        mergeProjects{
          id
          startTime
          endTime
          users{
            id
            email
            name
          }
          accountingFirm{
            id
            name
          }
          parentCompany{
            id
            type 
            nature
            name
            code
            address
            legalRepresentative
            establishDate
            registeredCapital
            paidinCapital
            businessScope
            holders{
              id
              name
              ratio
            }
          }
          sonCompanies{
            id
            type 
            nature
            name
            code
            address
            legalRepresentative
            establishDate
            registeredCapital
            paidinCapital
            businessScope
            holders{
              id
              name
              ratio
            }
          }
        }
    }
`

export default GET_MERGE_PROJECTS;