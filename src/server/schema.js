import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList
} from 'graphql/type';

import co from 'co';
import User from './user';

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */
function getProjection (fieldASTs) {
 // console.log('~~~~ fieldASTs', fieldASTs);
  return fieldASTs.selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = 1;
    return projections;
  }, {});
}

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'User creator',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the user.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the user.',
    },
    friends: {
      type: new GraphQLList(userType),
      description: 'The friends of the user, or an empty list if they have none.',
      resolve: (user, params, source, fieldASTs) => {
        // console.log('~~~~~~~', user, params, source, fieldASTs);
        // var projections = getProjection(fieldASTs);
        // return User.find({
        //   // _id: {
        //   //   // to make it easily testable
        //   //   $in: user.friends.map((id) => id.toString())
        //   // }
        // }, projections);
          return new Promise((resolve, reject) => {
              if (user.friends.length > 0) {
                  User.find({
                      _id: {
                          // to make it easily testable
                          $in: user.friends.map((id) => id.toString())
                      }
                  },function(err, users) {
                      if (err) reject(err)
                      else resolve(users)
                  })
              }else {
                  resolve([])
              }
          })
      },
    }
  })
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: function() {
          return 'world';
        }
      },
      usersList: {
          type: new GraphQLList(userType),
          resolve: function() {
              return new Promise((resolve, reject) => {
                  User.find({},function(err, users) {
                      if (err) reject(err)
                      else resolve(users)
                  })
              })
          }
      },
      // user: {
      //   type: userType,
      //   args: {
      //     id: {
      //       name: 'id',
      //       type: new GraphQLNonNull(GraphQLString)
      //     }
      //   },
      //   resolve: (root, {id}, source, fieldASTs) => {
      //     var projections = getProjection(fieldASTs);
      //       console.log('~~~~~~~ RootQueryType', root, {id}, source, fieldASTs);
      //     //return User.findById(id/*, projections*/);
      //       return User.find({_id: id});
      //   }
      // }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: userType,
        args: {
          name: {
            name: 'name',
            type: GraphQLString
          }
        },
        resolve: (obj, {name}, source, fieldASTs) => {
          console.log('~~~~ createUser:', name);
          return new Promise((resolve, reject) => {
              const user = new User();
              user.name = name;
              user.save(function(err, res) {
                  if (err) reject(err)
                  else resolve(res)
              })
          })
        }
      },
      deleteUser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {id}, source, fieldASTs) => {
          console.log('~~~~ deleteUser:', id);
          // var projections = getProjection(fieldASTs);
          // console.log(id);
          // return yield User.findOneAndRemove({_id: id});
          return new Promise((resolve, reject) => {
            User.findOneAndRemove({_id: id},function(err, deleteUser) {
              if (err) reject(err)
                else resolve(deleteUser)
            })
          })
        }
      },
      updateUser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            name: 'name',
            type: GraphQLString
          }
        },
        resolve: (obj, {id, name}, source, fieldASTs) => {
          // var projections = getProjection(fieldASTs);
          // yield User.update({
          //   _id: id
          // }, {
          //   $set: {
          //     name: name
          //   }
          // });
          //
          // return yield User.findById(id, projections);
          console.log('~~~~ updateUser:', id, name);
          return new Promise((resolve, reject) => {
              User.findByIdAndUpdate(id, {
                  $set: {
                      name: name
                  }
              }, { new: true }, function(err, updateUser) {
                  if (err) reject(err)
                  else resolve(updateUser)
              });
          })
        }
      }
    }
  })
});

export var getProjection;
export default schema;
