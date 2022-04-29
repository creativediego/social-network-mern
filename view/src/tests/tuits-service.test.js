import {
  createTuit,
  deleteTuit,
  findAllTuits,
  findTuitById,
  findTuitByUser,
} from '../services/tuits-service';
import { createUser, deleteUser } from '../services/users-service';

describe('TUIT API SERVICE', () => {
  const ripley = {
    name: 'Ellent Ripley',
    username: 'ellenripley',
    email: 'ellenripley@aliens.com',
    accountType: 'Personal',
    birthday: '01-02-1970',
    password: 'ripley123',
    bio: 'kill all aliens',
  };
  const sampleTuit = { tuit: "hello world! Let's hunt aliens..." };
  let databaseTuit;
  let user;

  beforeEach(async () => {
    user = await createUser(ripley); // create a user for the new tuit
    databaseTuit = await createTuit(user.id, sampleTuit); // create a tuit with the user
  });

  afterEach(async () => {
    await deleteTuit(databaseTuit.id);
    await deleteUser(user.id);
  });

  it('can create tuit', async () => {
    expect(databaseTuit.tuit).toBe(sampleTuit.tuit);
    expect(databaseTuit.author.name).toBe(ripley.name);
  });

  it('can delete tuit', async () => {
    const deleteCount = await deleteTuit(databaseTuit.id);
    expect(deleteCount).toBe(1);
  });

  it('can retrieve a tuit by their primary key', async () => {
    const retrievedTuit = await findTuitById(databaseTuit.id);

    expect(retrievedTuit.id).toBe(databaseTuit.id);
    expect(retrievedTuit.tuit).toBe(databaseTuit.tuit);
    expect(retrievedTuit.author.name).toBe(databaseTuit.author.name);
  });

  it('can retrieve all tuits', async () => {
    let insertedTuits = [];
    const sampleTuits = [{ tuit: '3 aliens down' }, { tuit: '4 aliens down' }];
    // insert sample tuits into backend
    for (const tuit of sampleTuits) {
      const dbTuit = await createTuit(user.id, tuit);
      insertedTuits.push(dbTuit);
    }

    // fetch all tuits
    const allFoundTuits = await findAllTuits();

    // compare each inserted tuit with matching found tuits
    insertedTuits.forEach((insertedTuit) => {
      const matchingFoundTuit = allFoundTuits.find(
        (foundTuit) => foundTuit.id === insertedTuit.id
      );
      expect(allFoundTuits.length).toBeGreaterThanOrEqual(2);
      expect(matchingFoundTuit.id).toBe(insertedTuit.id);
      expect(matchingFoundTuit.tuit).toBe(insertedTuit.tuit);
      expect(matchingFoundTuit.author.username).toBe(
        insertedTuit.author.username
      );
    });

    insertedTuits.forEach(async (tuit) => {
      await deleteTuit(tuit.id);
    });
  });
});
