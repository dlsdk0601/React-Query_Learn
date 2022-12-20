import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import {useInfiniteQuery} from "react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading, isError, error, isFetching
  } = useInfiniteQuery(
    "sw-species",
    ({ pageParam = initialUrl}) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined
      }
    );

  if(isLoading) return <div className="loading">Loading...</div>;

  if(isError) return <div className="loading">Error! {error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map(page => {
          return page.results.map((spec) => {
            return (
              <Species
                key={spec.name}
                name={spec.name}
                language={spec.language}
                averageLifespan={spec.average_lifespan}
              />
            );
          })
        })}
      </InfiniteScroll>
    </>
  );
}
