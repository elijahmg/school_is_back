import { expect, assert } from 'chai'
import { User, schema } from './user.model'
import { describe } from "mocha";
import { dropDb } from '../../../../test/helpers';
import gql from 'graphql-tag';
import { createTestClient } from 'apollo-server-integration-testing';
import server from '../../graphQLRouter';

describe.only('User with apollo', () => {
  let user;

  beforeEach(async () => {
    const { mutate } = createTestClient({ apolloServer: server });

    await dropDb();
    user = await mutate(
      gql`
          mutation CreateUser($input: NewUser!) {
              createUser(input: $input) {
                  id
                  username
              }
          }
      `,
      {
        variables: {
          input: {
            username: 'Jack Test',
            password: "123",
          },
        },
      });

    user = user.data.createUser;
  });

  afterEach(async () => {
    await dropDb();
  });

  it('Test login', async () => {
    const { mutate } = createTestClient({ apolloServer: server });
    const result = await mutate(
      gql`
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
      {
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

    const { query } = createTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          authorization: `Bearer ${token}`,
        }
      },
    });

    const getMeResult = await query(
      gql`{
          getMe {
              id,
          }
      }`);

    expect(getMeResult.errors).to.not.exist;
    assert.equal(getMeResult.data.getMe.id, result.data.login.user.id, 'Get me failed');
  });
});

