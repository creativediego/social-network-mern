import Tuits from '../components/tuits';
import { screen, render } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { findAllTuits, api } from '../services/tuits-service';

const MOCKED_USERS = ['alice', 'bob', 'charlie'];

// const MOCKED_TUITS = ["alice's tuit", "bob's tuit", "charlie's tuit"];

const MOCKED_TUITS = [
  { id: '1234', tuit: "alice's tuit" },
  { id: '567', tuit: "bob's tuit" },
  { id: '890', tuit: "charlie's tuit" },
];

const expectActualTuits = (tuits) => {
  for (const tuit of tuits) {
    const DOMtuit = screen.getByText(tuit.tuit);
    expect(DOMtuit).toBeInTheDocument();
  }
};

test('tuit list renders static tuit array', () => {
  render(
    <HashRouter>
      <Tuits tuits={MOCKED_TUITS} deleteTuit={() => 0} />
    </HashRouter>
  );
  for (const tuit of MOCKED_TUITS) {
    const DOMtuit = screen.getByText(tuit.tuit);
    expect(DOMtuit).toBeInTheDocument();
  }
});

test('tuit list renders async', async () => {
  const databaseTuits = await findAllTuits();

  render(
    <HashRouter>
      <Tuits tuits={databaseTuits} />
    </HashRouter>
  );
  expectActualTuits(databaseTuits);
});

test('tuit list renders mocked', async () => {
  const mock = jest.spyOn(api, 'get');

  api.get.mockImplementation(() =>
    Promise.resolve({ data: { tuits: MOCKED_TUITS } })
  );

  const res = await findAllTuits();
  render(
    <HashRouter>
      <Tuits tuits={res.tuits} />
    </HashRouter>
  );
  expectActualTuits(res.tuits);
  mock.mockRestore();
});
