import React from 'react'
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
    const [
      sendLinkValidateEmail] = useMutation(SEND_LINK_VALIDATE_EMAIL_MUTATION,{
        onCompleted({ sendLinkValidateEmail }) {
          alert("发送验证邮件成功")
        }
      });

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
            发送邮件
          </Button>
      </span>
    );
  }
