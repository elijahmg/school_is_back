import { expect } from 'chai'
import createApiSpec from '../../../../test/apiSpecs'
import { User, schema } from './user.model'
import { describe } from "mocha";
import { dropDb, runQuery } from '../../../../test/helpers';
import { connect } from '../../../db';
import gql from 'graphql-tag';

// createApiSpec(User, 'user', { username: 'stu', passwordHash: '123' });

describe.only('User', () => {
  let user;
  beforeEach(async () => {
    await dropDb();
    user = await User.create({ username: 'JackTest', password: '123' });
  });

  afterEach(async () => {
    await dropDb();
  });

  it('login', async () => {
    const loginResult = await runQuery(`
        mutation Login($input: NewUser!) {
            login(input: $input) {
                user {
                    id
                }
                token
            }
        }
    `, {
      input: {
        username: user.username,
        password: user.password,
      }
    }, user);

    expect(loginResult.errors).to.not.exist;

    const result = await runQuery(`{
        getMe {
          id
          username
        }
    }`, {}, user);

    expect(result.errors).to.not.exist;
  });

  it('should get me', async () => {
    const result = await runQuery(`{
        getMe {
          id
          username
        }
    }`, {}, user);

    expect(result.errors).to.not.exist;
    expect(result.data.getMe).to.be.an('object');
    expect(result.data.getMe.id).to.eql(user.id.toString());
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

