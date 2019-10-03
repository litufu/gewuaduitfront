import gql from "graphql-tag";

const GET_PROJECTS = gql`
    query Projects{
        projects{
          id
          startTime
          endTime
          members{
            id
            role
            user{
              id
              email
              name
            }
          }
          company{
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

export default GET_PROJECTS;