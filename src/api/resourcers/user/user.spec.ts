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
          password: '123',
          loginName: 'Jack',
        },
      },
    }
  );

  user = user.data.createUser;
});

test('Test login', async () => {
  const { mutate } = createTestClient({ apolloServer: server });

  const result: any = await mutate(
    gql`
      mutation Login($input: LoginUser!) {
        login(input: $input) {
          name
          loginName
          token
        }
      }
    `,
    {
      variables: {
        input: {
          loginName: user.loginName,
          password: '123',
        },
      },
    }
  );

  expect(result.errors).to.not.exist;
  expect(result.data.login.token).to.exist;
  assert.equal(result.data.login.name, 'Jack Test', 'Names match');

  const token = result.data.login.token;

  const { query } = createTestClient({
    apolloServer: server,
    extendMockRequest: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });

  const getMeResult: any = await query(
    gql`
      {
        getMe {
          id
          name
        }
      }
    `
  );

  expect(getMeResult.errors).to.not.exist;
  assert.equal(
    getMeResult.data.getMe.name,
    result.data.login.name,
    'Get me failed'
  );
});

test('Update myself', async () => {
  const { mutate } = createTestClient({ apolloServer: server });

  const result: any = await mutate(
    gql`
      mutation Login($input: LoginUser!) {
        login(input: $input) {
          name
          loginName
          token
        }
      }
    `,
    {
      variables: {
        input: {
          loginName: user.loginName,
          password: '123',
        },
      },
    }
  );

  const token = result.data.login.token;

  const { mutate: update } = createTestClient({
    apolloServer: server,
    extendMockRequest: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  await update(
    gql`
      mutation CreateSubject($input: NewSubject!) {
        createSubject(input: $input) {
          name
        }
      }
    `,
    {
      variables: {
        input: {
          name: 'Math',
        },
      },
    }
  );

  const resultUpdate: any = await update(
    gql`
      mutation Update($input: UserToUpdate!) {
        updateMyself(input: $input) {
          name
          subjects {
            name
          }
        }
      }
    `,
    {
      variables: {
        input: {
          subjects: ['Math'],
        },
      },
    }
  );

  expect(resultUpdate.errors).to.not.exist;
  expect(resultUpdate.data.updateMyself.subjects).to.have;
  assert.equal(resultUpdate.data.updateMyself.subjects[0].name, 'Math');
});

afterAll(async () => {
  await dropDb();
});
