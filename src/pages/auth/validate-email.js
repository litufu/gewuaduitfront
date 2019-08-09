import React from 'react';
import { useApolloClient,useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Location,navigate } from "@reach/router"
import { AUTH_TOKEN } from '../../constant'
import { ValidateEmailShow,Loading} from '../../components';

const VALIDATE_EMAIL_TOKEN_MUTATION = gql`
  mutation ValidateEmailMutation($validateEmailToken: String!) {
    validateEmail(validateEmailToken: $validateEmailToken) {
      token
      user {
        name
        emailvalidated
        id
      }
    }
  }
`

const SEND_LINK_VALIDATE_EMAIL_MUTATION = gql`
  mutation sendLinkValidateEmailMutation {
    sendLinkValidateEmail {
      email
    }
  }
`

export default function ValidateEmail(props) {
  const client = useApolloClient();
  const [validateEmail, { loading, error }] = useMutation(
    VALIDATE_EMAIL_TOKEN_MUTATION,
    {
      onCompleted({ resetPassword }) {
        localStorage.setItem(AUTH_TOKEN, resetPassword.token);
        localStorage.setItem('userToken', JSON.stringify(resetPassword.user))
        client.writeData({ data: { isLoggedIn: true } });
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <p>邮箱验证失败。</p>;

  return (
    <Location>
        {({ location })=> {

        return (
            <ValidateEmailShow
            location={location}
            validateEmail={validateEmail}
            />
           
        )
        }}
  </Location>
  );
  
}