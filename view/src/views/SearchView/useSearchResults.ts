import * as React from 'react';
//@ts-ignore
import { Tuits } from '../../components';
// @ts-ignore
import * as searchService from '../../services/search-service';
import PeopleSearchResults from './PeopleSearchResults';
import { useDispatch } from 'react-redux';
// @ts-ignore
import { setGlobalError } from '../../redux/errorSlice';

interface QueryTypeMap {
  [key: string]: {
    type: string;
    APICall: (SearchKeyword: string) => Promise<any>;
    results: {
      [key: string]: any[];
    };
  };
}

const useSearchResults = (
  queryType: string,
  searchValue: string
): [boolean, QueryTypeMap] => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [categories, setCategories] = React.useState<QueryTypeMap>({
    top: {
      type: 'top',
      APICall: searchService.findAllByKeyword,
      results: { users: [], tuits: [] },
    },
    tuits: {
      type: 'tuits',
      APICall: searchService.findAllTuitsByKeyword,
      results: { tuits: [] },
    },
    people: {
      type: 'people',
      APICall: searchService.findAllUsersByKeyword,
      results: { users: [] },
    },
  });

  const submitSearch = React.useCallback(
    async (keyword: string, type: string) => {
      const invalidKeyword = new RegExp(/^[^a-zA-Z]{1}$/);
      if (keyword.match(invalidKeyword)) {
        return [];
      }
      let formattedKeyword = keyword;
      if (keyword[0] === '#') {
        formattedKeyword = keyword.replace(/#/, ''); // strip first occurrence
      }
      const APICall = categories[type].APICall;
      if (APICall) {
        setLoading(true);
        return await APICall(formattedKeyword);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(() => {
    if (!searchValue) {
      return;
    }
    let isAPISubscribed = true;
    submitSearch(searchValue, queryType).then((results) => {
      setLoading(false);
      if (results.error) {
        dispatch(setGlobalError(results.error));
        return;
      }
      if (isAPISubscribed) {
        setCategories((prevCategories) => ({
          ...prevCategories,
          [queryType]: { ...prevCategories[queryType], results },
        }));
      }
    });

    return () => {
      //cleanup
      isAPISubscribed = false;
    };
  }, [searchValue, queryType, submitSearch, dispatch]);
  return [loading, categories];
};

export default useSearchResults;
