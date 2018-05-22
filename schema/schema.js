const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

//Hardcode Users require lodash
// const users = [
//   { id: '23', firstName: 'Bill', age: 20 },
//   { id: '47', firstName: 'Samantha', age: 21 }
// ];

// Types of Data
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      users: {
        type: new GraphQLList(UserType),
        resolve(parentValue, args) {
          return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
            .then(res => res.data);
        }
      }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        console.log(parentValue, args)
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
});

// For GraphQL to find the first Query (Root Query)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } }, //argument: given id => find user
      resolve(parentValue, args) {           // actual action of going into database
        // return _.find(users, { id: args.id} ); //lodash will find user has the id
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data); // { data: { firstName: 'bill' } }

      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
