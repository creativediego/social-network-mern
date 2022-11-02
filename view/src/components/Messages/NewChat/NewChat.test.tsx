import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewChat from './NewChat';
import { useSearch } from '../../Search/useSearch';
import { useNewChat } from './useNewChat';
import { Provider } from 'react-redux';
import store from '../../../redux/store';

// jest.mock('./useNewChat', () => ({
//   useNewChat: () => {
//     return {
//       newChatLoading: false,
//       selectedUsers: [],
//       selectUsersForChat: () => {},
//       removeSelectedUser: [],
//       createNewChat: () => {},
//     };
//   },
// }));

// jest.mock('../../Search/useSearch');
// jest.mock('../../Search/useSearch', () => ({
//   useSearch: () => {
//     return {
//       searchResults: [],
//       searchLoading: false,
//       searchValue: '',
//       setSearch: (value: string) => {},
//     };
//   },
// }));
// const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
// mockUseSearch.getMockName();
// mockUseSearch.mockImplementation(() => {
//   return {
//     searchResults: [],
//     searchLoading: false,
//     searchValue: '',
//     setSearch: (value: string) => {},
//   };
// });
// mockUseSearch.mockImplementation(() => {
//   return {
//     searchResults: [],
//     searchLoading: false,
//     searchValue: '',
//     setSearch: (value: string) => {},
//   };
// });

// jest.mock('../../../hooks/useError', () => ({
//   useError: () => {
//     return {
//       error: {
//         message: '',
//       },
//     };
//   },
// }));

const renderNewChatDialog = () => {
  render(
    <Provider store={store}>
      <NewChat />
    </Provider>
  );
  const user = userEvent;
  const newChatButton = screen.getByRole('button', { name: 'new chat' });
  user.click(newChatButton);
};

describe('user', () => {
  test('clicks the new chat button to display new chat modal', async () => {
    renderNewChatDialog();
    const newChatModal = screen.getByRole('dialog', { name: 'New chat' });
    expect(newChatModal).toBeInTheDocument();
  });

  test('searches for another user to initiate a private chat with.', () => {
    renderNewChatDialog();
    const searchBox = screen.getByPlaceholderText(
      'Search for people to start new chat'
    );
    userEvent.type(searchBox, 'Bruce Wayne');
    // const { setSearch } = mockUseSearch((): any => {});

    // expect(setSearch).toHaveBeenCalledWith('Bruce Wayne');
    // jest.mock('../../Search/useSearch', () => ({
    //   useSearch: () => {
    //     return {
    //       searchResults: [
    //         {
    //           id: '1',
    //           username: 'batman',
    //           name: 'Bruce Wayne',
    //           email: '',
    //           bio: '',
    //           headerImage: 'string',
    //         },
    //       ],
    //       searchLoading: false,
    //       searchValue: '',
    //       setSearch: () => {},
    //     };
    //   },
    // }));
  });

  test('selects and deselect a user from search results.', () => {});

  test('creates a new chat with selected user.', () => {});
});
