import koa from 'koa';
import Router from 'koa-router';
import qs from 'koa-qs';
import parseBody from 'co-body';
import mongoose from 'mongoose';
import {graphql} from 'graphql';
import schema from './schema';
import GraphHTTP from 'express-graphql';
import express from 'express';
import bodyParser from 'body-parser';

let port = process.env.PORT || 3000;
// let routes = new Router();
// var app = koa();

const app = express();

// support nested query tring params
// qs(app);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/graphql');
}

// routes.get('/data', function* () {
//   var query = this.query.query;
//   var params = this.query.params;
//
//   var resp = yield graphql(schema, query, '', params);
//
//   if (resp.errors) {
//     this.status = 400;
//     this.body = {
//       errors: resp.errors
//     };
//     return;
//   }
//
//   this.body = resp;
// });

// routes.post('/data', function* () {
//   var payload = yield parseBody(this);
//   var resp = yield graphql(schema, payload.query, '', payload.params);
//
//   if (resp.errors) {
//     this.status = 400;
//     this.body = {
//       errors: resp.errors
//     };
//     return;
//   }
//
//   this.body = resp;
// });
// app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

app.use('/graphql', GraphHTTP({
 schema: schema,
 pretty: true,
 graphiql: true
}));
// app.use(routes.middleware());

app.listen(port, () => {
  console.log('app is listening on ' + port);
});

module.exports = app;
