import gql from 'graphql-tag';

const COMPANY_FRAGMENT = gql`
  fragment CompanyFragment on Company {
        id
        name
        code
        address
        legalRepresentative
        establishDate
        registeredCapital
        businessScope
        holders{
            id
            name
            ratio
        }
        relatedParties{
            id
            grade
            relationship
            type
            name
        }
 }
 
`
export default COMPANY_FRAGMENT;