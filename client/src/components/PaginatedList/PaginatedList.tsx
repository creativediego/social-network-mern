// import React, { useEffect } from 'react';
// import { useSimplePagination } from '../../hooks/useSimplePagination';

// interface PaginatedListProps<T> {
//   fetchData: () => Promise<T[]>;
//   renderItem: (item: T) => JSX.Element;
// }

// function PaginatedList<T>({ fetchData, renderItem }: PaginatedListProps<T>) {
//   const { data, loading, fetchNextPage } = useSimplePagination(fetchData);

//   useEffect(() => {
//     // Add event listener for scrolling to trigger fetchNextPage when scrolled to the bottom
//     const handleScroll = () => {
//       const { scrollTop, clientHeight, scrollHeight } =
//         document.documentElement;
//       if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
//         fetchNextPage();
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [fetchNextPage, loading]);

//   return (
//     <ul>
//       {data.map((item, index) => (
//         <li key={index}>{renderItem(item)}</li>
//       ))}
//       {loading && <li>Loading...</li>}
//     </ul>
//   );
// }

// export default PaginatedList;
