import { expect, assert } from 'chai';
import gql from 'graphql-tag';
import { createTestClient } from 'apollo-server-integration-testing';

import { dropDb } from '../../../../test/helpers';
import server from '../../graphQLRouter';

let user;

beforeEach(async () => {
  await dropDb();

  const { mutate } = createTestClient({ apolloServer: server });

  user = await mutate(
    gql`
        mutation CreateUser($input: NewUser!) {
            createUser(input: $input) {
                id
                name
                loginName
            }
        }
    `,
    {
      variables: {
        input: {
          name: 'Jack Test',
          password: "123",
          loginName: 'Jack',
          roles: ['ADMIN']
        },
      },
    });

  user = user.data.createUser;
});

test('Test login', async () => {
  const { mutate } = createTestClient({ apolloServer: server });

  const result = await mutate(
    gql`
        mutation Login($input: LoginUser!) {
            login(input: $input) {
                name
                loginName
                roles
                token
            }
        }
    `,
    {
      variables: {
        input: {
          loginName: user.loginName,
          password: "123",
        },
      }
    });

  expect(result.errors).to.not.exist;
  expect(result.data.login.token).to.exist;
  assert.equal(result.data.login.name, 'Jack Test', 'Names match');

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
            name
        }
    }`);

  expect(getMeResult.errors).to.not.exist;
  assert.equal(getMeResult.data.getMe.name, result.data.login.name, 'Get me failed');
});

afterAll(async () => {
  await dropDb();
});
