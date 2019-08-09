import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button'

const SEND_LINK_VALIDATE_EMAIL_MUTATION = gql`
  mutation sendLinkValidateEmailMutation {
    sendLinkValidateEmail {
      email
    }
  }
`
export default function ResendEmail() {
    const [sendLinkValidateEmail, { data }] = useMutation(SEND_LINK_VALIDATE_EMAIL_MUTATION);

    return (
        <span>
          <Button 
          color="primary"
          variant='text' 
          onClick={() => {
                sendLinkValidateEmail({
                    variables: {
                    },
                })
          }}>
            重发邮件
          </Button>
      </span>
    );
  }
