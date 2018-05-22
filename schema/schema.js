const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;

//Hardcode Users
const users = [
  { id: '23', firstName: 'Bill', age: 20 },
  { id: '47', firstName: 'Samantha', age: 21 }
];

// First Type of Data
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

// For GraphQL to find the first Query (Root Query)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } }, //argument: given id => find user
      resolve(parentValue, args) {           // actual action of going into database
        return _.find(users, { id: args.id} );
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
