import * as React from 'react';

interface SearchProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  placeHolder: string;
}
/**
 * Search box with dynamic state as the user types. Input state is maintained by the parent component, which uses it to dispatch an action.
 * @param {string} searchValue the input value of the search box
 * @param {Function} setInputValue sets the searchValue state
 */
const Search: React.FC<SearchProps> = ({
  searchValue,
  setSearchValue,
  placeHolder,
}) => {
  return (
    <div className='ttr-search position-relative'>
      {/* <i className='fas fa-search position-absolute'></i> */}
      <input
        className='bg-dark bg-opacity-10 border-0 form-control form-control-sm rounded-pill ps-4'
        placeholder={placeHolder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
    </div>
  );
};

export default Search;
