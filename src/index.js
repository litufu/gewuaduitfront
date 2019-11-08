import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
// import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloProvider} from '@apollo/react-hooks';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import { AUTH_TOKEN ,uri,connectToDevTools} from './constant'
import theme from './theme';
import { resolvers, typeDefs } from './resolvers'; 
import App from './pages';
import * as serviceWorker from './serviceWorker';


const cache = new InMemoryCache();
// const httpLink = new HttpLink({ uri: 'http://localhost:5000/graphql' })
const httpLink = createUploadLink({ uri })

const middlewareAuthLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const httpLinkAuth  = middlewareAuthLink.concat(httpLink)


const client = new ApolloClient({
  link: httpLinkAuth,
  cache,
  resolvers,
  typeDefs,
  connectToDevTools,
})

const userToken = JSON.parse(localStorage.getItem("userToken"))

const data = {
  isLoggedIn: !!localStorage.getItem(AUTH_TOKEN),
  emailValidated:userToken && userToken.emailvalidated
}
cache.writeData({data});
client.onResetStore(() => cache.writeData({ data }));



ReactDOM.render(
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>,
    document.getElementById('root'),
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
