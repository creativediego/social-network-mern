/* eslint-disable testing-library/no-unnecessary-act */
import { Provider } from 'react-redux';
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
  within,
} from '@testing-library/react';
import TuitStats from '../components/Tuits/TuitStats';
import configureStore from 'redux-mock-store';
import * as service from '../services/likes-service';

describe('Tuit stats', () => {
  let tuit;
  let tuitStats;
  let root;
  let store;

  beforeAll(() => {
    // The LikeDislikeButton component nested in TuitStats uses redux, so first set up mock state.
    const initialState = { user: { data: { id: '666' } } };
    const mockStore = configureStore();
    store = mockStore(initialState);

    // our mock tuit with stats
    tuit = {
      stats: {
        likes: 123,
        dislikes: 2,
        replies: 234,
        retuits: 333,
      },
      likedBy: [],
      dislikedBy: [],
    };
  });

  const setup = () =>
    render(
      // redux provider required by component
      <Provider store={store}>
        <TuitStats tuit={tuit} />
      </Provider>
    );

  test('likes stats renders correctly', async () => {
    setup();
    const likesStats = await screen.findByTestId('ttr-stats-likes');
    const likesCount = within(likesStats).getByText('123');
    expect(likesCount).toBeInTheDocument();
  });

  test('likes stats increases by 1 when clicked and updates css as needed', async () => {
    setup();

    const mock = jest.spyOn(service, 'userLikesTuit');
    mock.mockImplementation(async () => Promise.resolve(tuit));

    act(() => {
      const likeButton = screen.getByTestId('ttr-like-btn');
      tuit.stats.likes++;
      tuit.likedBy = ['666']; // userId
      fireEvent.click(likeButton);
    });
    // Count should have updated from 123 to 124.
    await waitFor(() => {
      const increasedLike = screen.getByText('124');
      expect(increasedLike).toBeInTheDocument();
    });
    expect(service.userLikesTuit).toHaveBeenCalledTimes(1);

    mock.mockRestore();
  });

  test('dislikes stats renders correctly', async () => {
    setup();
    const likesStats = await screen.findByTestId('ttr-stats-dislikes');
    const likesCount = within(likesStats).getByText('2');
    expect(likesCount).toBeInTheDocument();
  });

  test('dislikes stats decreases by 1 when clicked and updates css as needed', async () => {
    setup();
    let dislikeButton;
    const mock = jest.spyOn(service, 'userDislikesTuit');
    mock.mockImplementation(async () => Promise.resolve(tuit));

    act(() => {
      dislikeButton = screen.getByTestId('ttr-dislike-btn');
      tuit.stats.likes--;
      tuit.stats.dislikes++;
      tuit.likedBy = ['666']; // userId
      fireEvent.click(dislikeButton);
    });

    await waitFor(() => {
      const increasedDislike = within(dislikeButton).getByText('3');
      expect(increasedDislike).toBeInTheDocument();
    });

    await waitFor(() => {
      const likeButton = screen.getByTestId('ttr-like-btn');
      const decreasedLike = within(likeButton).getByText('123');
      expect(decreasedLike).toBeInTheDocument();
    });

    expect(service.userDislikesTuit).toHaveBeenCalledTimes(1);

    mock.mockRestore();
  });

  test('replies stats renders correctly', async () => {
    setup();
    const likesStats = await screen.findByTestId('ttr-stats-replies');
    const likesCount = within(likesStats).getByText('234');
    expect(likesCount).toBeInTheDocument();
  });

  test('retuits stats renders correctly', async () => {
    setup();
    const likesStats = await screen.findByTestId('ttr-stats-retuits');
    const likesCount = within(likesStats).getByText('333');
    expect(likesCount).toBeInTheDocument();
  });
});
