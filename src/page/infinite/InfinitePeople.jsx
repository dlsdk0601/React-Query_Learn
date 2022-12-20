import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error, isFetching } = useInfiniteQuery(
    "sw-people",
    ({ pagesParam = initialUrl }) => fetchUrl(pagesParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined
    }
  );

  // useInfiniteQuery vs useQuery
  // 반환되는 객체가 다름
  // useUnfiniteQuery 는 두개의 프로퍼티를 가짐 => pages(배엶) pagesParams

  if(isLoading) {
    return <div className="loading">Loading...</div>
  }

  if(isError){
    return <div>Error! {error.toString()}</div>
  }

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
      loadMore={fetchNextPage}
      hasMore={hasNextPage}
      >
        {data.pages.map(page => {
          return page.results.map(person => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            )
          })
        })}
      </InfiniteScroll>
    </>
  );
}
