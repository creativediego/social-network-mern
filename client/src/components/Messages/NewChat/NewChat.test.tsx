import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import NewChat from './NewChat';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { IUser } from '../../../interfaces/IUser';

jest.mock('./useNewChat', () => ({
  useNewChat: () => {
    return {
      newChatLoading: false,
      selectedUsers: [],
      selectUsersForChat: () => {},
      removeSelectedUser: [],
      createNewChat: () => {},
    };
  },
}));

// jest.mock('../../Search/useSearch');
const mockSetSearch = jest.fn();
let mockSearchResults: IUser[] = [];

jest.mock('../../Search/useSearch', () => ({
  useSearch: () => {
    return {
      searchResults: mockSearchResults,
      setSearch: mockSetSearch,
    };
  },
}));

// jest.mock('../../../hooks/useError', () => ({
//   useError: () => {
//     return {
//       error: {
//         message: '',
//       },
//     };
//   },
// }));
const renderNewChat = () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<NewChat />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};
const renderNewChatDialog = (user: UserEvent) => {
  renderNewChat();
  const newChatButton = screen.getByRole('button', { name: 'new chat' });
  user.click(newChatButton);
};

describe('When creating a new chat:', () => {
  test('New chat modal not displayed.', () => {});

  test('User clicks the new chat button to display new chat modal.', async () => {
    const user = userEvent.setup();
    renderNewChat();
    const newChatButton = screen.getByRole('button', { name: 'new chat' });
    user.click(newChatButton);
    const newChatModal = await screen.findByRole('dialog', {
      name: 'New chat dialog',
    });
    expect(newChatModal).toBeInTheDocument();
  });

  test('Search results and create new chat button not displayed.', () => {});

  test('User searches for a user to initiate a private chat with.', async () => {
    const user = userEvent.setup();
    const value = 'Bruce Wayne';
    renderNewChatDialog(user);
    const searchBox = await screen.findByPlaceholderText(
      'Search for people to start new chat'
    );
    await user.type(searchBox, value);

    expect(searchBox).toHaveValue(value);
    expect(mockSetSearch).toHaveBeenCalledWith(value);
    expect(mockSetSearch).toHaveBeenCalledTimes(11);
  });

  test('Search results are displayed.', () => {
    mockSearchResults = [
      {
        id: '1',
        name: 'Clark Kent',
        username: 'superman',
        email: 'superman@superman.com',
        headerImage: '',
        bio: '',
        profilePhoto: '',
      },
    ];
  });

  test('User selects and deselects a user from search results.', () => {});

  test('User creates a new chat with selected user.', () => {});

  test('Pop up modal disappears.', () => {});

  test('New chat window appears with participants and chat text box.', () => {});
});
