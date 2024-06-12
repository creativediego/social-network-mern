import { memo } from 'react';
interface SearchProps {
  query: string;
  setQuery: (val: string) => void;
  placeHolder: string;
}
/**
 * `Search` is a component that renders a search box with dynamic state as the user types.
 * The input state is maintained by the parent component, which uses it to dispatch an action.
 * The `Search` component takes in a `query`, a `setQuery` function, and a `placeHolder` as props.
 * When the value of the input changes, it calls the `setQuery` function with the new value.
 *
 * @param {SearchProps} props - The properties passed to the component.
 * @param {string} props.query - The current value of the search query.
 * @param {(val: string) => void} props.setQuery - The function to update the search query.
 * @param {string} props.placeHolder - The placeholder for the search box.
 *
 * @returns {JSX.Element} The `Search` component, which includes a search box that updates its state as the user types.
 *
 * @example
 * <Search query={query} setQuery={setQuery} placeHolder={placeHolder} />
 */
const Search = ({ query, setQuery, placeHolder }: SearchProps) => {
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
