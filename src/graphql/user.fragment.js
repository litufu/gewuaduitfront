import gql from 'graphql-tag';

const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    name
    email
    role
 }
 
`
export default USER_FRAGMENT;