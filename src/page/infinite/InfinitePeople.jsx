import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {

  // fetchNextPage => 다음 페이지 데이터를 부르는 함수
  // hasNextPage => isNext
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error, isFetching } = useInfiniteQuery(
    "sw-people",
    ({ pagesParam = initialUrl }) => fetchUrl(pagesParam), // 전 페이지 pagesParam을 받아와서 넘긴다. 때문에 초기값 설정 필요
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined // 다음 api를 요청 할 때 사용될 pageParam값을 정하는 옵션
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
      {/* 스크롤 내려서 중간에 보이는 로딩때문에 필요. 초기 로딩 x */}
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
