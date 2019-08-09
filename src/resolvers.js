import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    loginStatus: String!
  }
  
`;

export const resolvers = {
 
  Mutation: {
  },
};