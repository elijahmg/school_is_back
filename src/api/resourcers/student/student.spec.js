import { expect, assert } from 'chai'
import { Student, schema } from './student.model'
import { describe } from "mocha";
import { dropDb } from '../../../../test/helpers';
import gql from 'graphql-tag';
import { createTestClient } from 'apollo-server-integration-testing';
import server from '../../graphQLRouter';

describe.only('Student with apollo', () => {
  let student;

  beforeEach(async () => {
    const { mutate } = createTestClient({ apolloServer: server });

    await dropDb();
    student = await mutate(
      gql`
          mutation CreateStudent($input: NewStudent!) {
              createStudent(input: $input) {
                  id
                  name
              }
          }
      `,
      {
        variables: {
          input: {
            name: 'Jack Test',
            password: "123",
          },
        },
      });

    student = student.data.createStudent;
  });

  afterEach(async () => {
    await dropDb();
  });

  it('Test login', async () => {
    const { mutate } = createTestClient({ apolloServer: server });
    const result = await mutate(
      gql`
          mutation Login($input: NewStudent!) {
              login(input: $input) {
                  student {
                      id
                      name
                  }
                  token
              }
          }
      `,
      {
        variables: {
          input: {
            name: student.name,
            password: "123",
          },
        }
      });

    expect(result.errors).to.not.exist;
    expect(result.data.login.token).to.exist;
    assert.equal(result.data.login.student.name, 'Jack Test', 'Names match');

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
    assert.equal(getMeResult.data.getMe.id, result.data.login.student.id, 'Get me failed');
  });
});

