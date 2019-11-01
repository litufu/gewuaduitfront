import gql from "graphql-tag";
import COMPANY_FRAGMENT from './company.fragment'

const GET_COMPANIES = gql`
    query GetCompanies($companyNames:[String]!){
        getCompanies(companyNames:$companyNames){
            ...CompanyFragment
        }
    }
${COMPANY_FRAGMENT}
`;

export default GET_COMPANIES;