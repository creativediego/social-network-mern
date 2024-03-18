import React, { memo } from 'react';
interface SearchProps {
  query: string;
  setQuery: (val: string) => void;
  placeHolder: string;
}
/**
 * Search box with dynamic state as the user types. Input state is maintained by the parent component, which uses it to dispatch an action.
 */
const Search: React.FC<SearchProps> = ({ query, setQuery, placeHolder }) => {
  return (
    <div className='ttr-search position-relative'>
      {/* <i className='fas fa-search position-absolute'></i> */}
      <input
        type='text'
        aria-label='search box'
        className='bg-dark bg-opacity-10 border-0 form-control form-control-sm rounded-pill ps-4'
        placeholder={placeHolder}
        value={query}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          setQuery(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default memo(Search);
