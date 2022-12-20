import {useEffect, useState} from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if(currentPage < maxPostPage){
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage));
    }
  }, [currentPage, queryClient])

  const { data, isLoading, isError, error } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
    staleTime: 2000, // 2초마다 데이터가 만료되도록 설정, default는 0초 데이터를 계속 최신으로 유지하기 위
      keepPreviousData: true
  });
  // isFetching
  // => 비동기 쿼리가 해결되지 않았음

  // isLoading
  // => 가져오는 상태 쿼리함수가 아직 해결되지 않음,
  // 캐시에 해당 데이터가 없다는 의미이기도함.(처음 부르는 쿼리)
  // => isFetching보다 하위 집합.

  if(isLoading) return <h3>Loading...</h3>;

  if(isError) return (
    <>
      <h3>Oops, something went wrong</h3>
      <p>{error.toString()}</p>
    </>
  );

  //staleTime
  // => staleTime 데이터가 유효한 최대의 시간.
  // 데이터가 만료되지 않으면, 리페칭은 실행되지 않는다.

  // cache data
  // => 나중에 필요할 수도 있는 data
  // 캐시가 만료되면, 가비지 컬렉션이 실행되고
  // 클라이언트는 데이터를 사용 할 수 없게 된다.
  // cacheTime은 default가 5분

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
          setCurrentPage(prev => prev - 1);
        }}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage(prev => prev + 1);
          }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
