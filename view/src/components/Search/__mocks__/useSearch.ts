// export const useSearch = jest.createMockFromModule<any>('useSearch');
export const useSearch = jest.fn(() => ({
  useSearch: () => {
    return {
      searchResults: [],
      searchLoading: false,
      searchValue: '',
      setSearch: () => {},
    };
  },
}));
// useSearch.mockImplementation(() => ({
//   useSearch: () => {
//     return {
//       searchResults: [],
//       searchLoading: false,
//       searchValue: '',
//       setSearch: () => {},
//     };
//   },
// }));
// useSearch.useSearch = () => {
//   return {
//     searchResults: [],
//     searchLoading: false,
//     searchValue: '',
//     setSearch: () => {},
//   };
// };

// export const useSearch2 = jest.mock('../../Search/useSearch', () => ({
//   useSearch: () => {
//     return {
//       searchResults: [],
//       searchLoading: false,
//       searchValue: '',
//       setSearch: () => {},
//     };
//   },
// }));
