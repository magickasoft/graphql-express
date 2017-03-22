import mongoose from 'mongoose';
import User from '../src/server/user';
import Faker from 'faker';
import _ from 'lodash';
// connect to mongo

mongoose.connect('mongodb://localhost/graphql');

// seed users

var users = [

  {
    _id: '559645cd1a38532d14349240',
    name: 'Han Solo',
    descript: 'Text text Text text Text textText textText textText',
    friends: []
  },

  {
    _id: '559645cd1a38532d14349241',
    name: 'Chewbacca',
    descript: 'Text text Text text Text textText textText textText',
    friends: ['559645cd1a38532d14349240']
  },

  {
    _id: '559645cd1a38532d14349242',
    name: 'R2D2',
    descript: 'Text text Text text Text textText textText textText ',
    friends: ['559645cd1a38532d14349246','559645cd1a38532d14349240', '559645cd1a38532d14349241']
  },

  {
    _id: '559645cd1a38532d14349246',
    name: 'Luke Skywalker',
    descript: 'Text text Text text Text textText textText textTextt',
    friends: ['559645cd1a38532d14349240', '559645cd1a38532d14349242']
  }
];


// drop users collection

mongoose.connection.collections['users'].drop( function(err) {

    _.times(100, ()=> {
        return new Promise((resolve, reject) => {
            const user = new User();
            user.name = `${Faker.name.firstName()} ${Faker.name.lastName()}`;
            user.descript = `${Faker.lorem.sentences()}`;
            user.friends = [];
            user.save(function(err, res) {
                if (err) reject(err)
                else resolve(res)
            })
        });

        // return Person.create({
        //     firstName: Faker.name.firstName(),
        //     lastName: Faker.name.lastName(),
        //     email: Faker.internet.email()
        // }).then(person => {
        //
        // });
    });
  User.create(users, function(err, res) {

    if (err) {
      console.log(err);
    }
    else {
      console.log('Seed data created.');
    }

    process.exit();

  });

});


