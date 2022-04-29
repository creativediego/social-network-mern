import { UserList } from '../components/profile/user-list';
import { screen, render } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { findAllUsers, api } from '../services/users-service';

const MOCKED_USERS = [
  {
    username: 'ellen_ripley',
    password: 'lv426',
    email: 'repley@weyland.com',
    id: '123',
  },
  {
    username: 'sarah_conor',
    password: 'illbeback',
    email: 'sarah@bigjeff.com',
    id: '234',
  },
];

test('user list renders static user array', () => {
  render(
    <HashRouter>
      <UserList users={MOCKED_USERS} />
    </HashRouter>
  );
  const linkElement = screen.getByText(/ellen_ripley/i);
  expect(linkElement).toBeInTheDocument();
});

test('user list renders async', async () => {
  const users = await findAllUsers();
  render(
    <HashRouter>
      <UserList users={users} />
    </HashRouter>
  );
  const linkElement = screen.getByText(/NASA/i);
  expect(linkElement).toBeInTheDocument();
});

test('user list renders mocked', async () => {
  const mock = jest.spyOn(api, 'get');

  api.get.mockImplementation(() =>
    Promise.resolve({ data: { users: MOCKED_USERS } })
  );

  const res = await findAllUsers();
  render(
    <HashRouter>
      <UserList users={res.users} />
    </HashRouter>
  );

  const user = screen.getByText(/ellen_ripley/i);
  expect(user).toBeInTheDocument();
  mock.mockRestore();
});
