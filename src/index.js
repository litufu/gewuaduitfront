import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link'
import { ApolloProvider} from '@apollo/react-hooks';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import { AUTH_TOKEN } from './constant'
import theme from './theme';
import { resolvers, typeDefs } from './resolvers'; 
import App from './pages';
import * as serviceWorker from './serviceWorker';


const cache = new InMemoryCache();
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  })
  return forward(operation)
})

const httpLinkAuth  = middlewareAuthLink.concat(httpLink)


const client = new ApolloClient({
  link: httpLinkAuth,
  cache,
  resolvers,
  typeDefs,
  connectToDevTools: true,
})

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem(AUTH_TOKEN),
    loginStatus: "signin"
  },
});



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
