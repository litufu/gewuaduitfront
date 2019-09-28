import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    emailValidated: Boolean!
  }
  
`;

export const resolvers = {
 
  Mutation: {
  },
};