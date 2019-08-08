import gql from "graphql-tag";
import USER_FRAGMENT from './user.fragment'


const GET_ME = gql`
{
  me {
    ...UserFragment
  }
}
${USER_FRAGMENT}
`;

export default GET_ME;