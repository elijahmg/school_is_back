import { expect, assert } from 'chai'
import { User, schema } from './user.model'
import { describe } from "mocha";
import { dropDb } from '../../../../test/helpers';
import gql from 'graphql-tag';
import { createTestClient } from 'apollo-server-testing';
import server from '../../graphQLRouter';

describe.only('User with apollo', () => {
  let user;

  const { query, mutate } = createTestClient(server);
  beforeEach(async () => {
    await dropDb();
    user = await mutate({
      mutation: gql`
          mutation CreateUser($input: NewUser!) {
              createUser(input: $input) {
                  id
                  username
              }
          }
      `,
      variables: {
        input: {
          username: 'Jack Test',
          password: "123",
        },
      }
    });

    user = user.data.createUser;
  });

  afterEach(async () => {
    await dropDb();
  });

  it('Test login', async () => {
    const result = await mutate({
      mutation: gql`
          mutation Login($input: NewUser!) {
              login(input: $input) {
                  user {
                      id
                      username
                  }
                  token
              }
          }
      `,
      variables: {
        input: {
          username: user.username,
          password: "123",
        },
      }
    });

    expect(result.errors).to.not.exist;
    expect(result.data.login.token).to.exist;
    assert.equal(result.data.login.user.username, 'Jack Test', 'Names match');

    const token = result.data.login.token;

    await server.config.context({
      req: {
        headers: {
          authorization: `Bearer ${token}`,
        }
      }
    });

    const getMeResult = await query({
      query: gql`{
          getMe {
              id,
          }
      }`,
    });

    console.log('getMeResult', getMeResult);

    expect(getMeResult.errors).to.not.exist;
    assert.equal(getMeResult.data.getMe.id, result.data.login.user.id, 'Get me failed');
  });
});

// describe('User Model', () => {
//   it('should have username', () => {
//     expect(schema.username).to.exist;
//     expect(schema.username.type).to.eql(String);
//     expect(schema.username.required).to.equal(true);
//     expect(schema.username.unique).to.equal(true);
//   });
//
//   it('should have passwordHash', () => {
//     expect(schema.passwordHash).to.exist;
//     expect(schema.username.type).to.eql(String);
//     expect(schema.username.required).to.equal(true);
//   })
// });

