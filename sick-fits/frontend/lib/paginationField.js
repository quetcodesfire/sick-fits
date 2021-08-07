import { mergeDeep } from '@apollo/client/utilities';
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      console.log([existing, args, cache]);
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are items and there aren't enough items to satisfy how many were requested
      // and we are on the last page then just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      // we don't have any items, we must go to the network to fetch them
      if (items.length !== first) {
        return false;
      }

      // If there are items, just return them from the cache and we don't need to go to the network
      if (items.length) {
        return items;
      }

      return false;
    },

    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }
      // finally we return the merged items from the cache
      return merged;
    },
  };
}
