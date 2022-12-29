import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;

  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  // useQueryClient를 호출하면 위에서 생성자 함수,
  // QueryClient를 통해 만들어진 객체의 정보를 얻을 수 있다.
  const queryClient = useQueryClient();

  // TODO: call useQuery to update user data from server
  const { data: user } = useQuery(queryKeys.user, () => getUser(user), {
    initialData: getStoredUser, // 쿼리키에 해당 함수의 return 값을 초기데이터로 넣는다.
    // 즉 user 데이터가 localStorage에 잇으면, 해당 데이터를 캐시에 저장시켜 서버통신해서 가져온 데이터처럼 보이게한다.
    // :::: 비추인게, userData를 sessionStorage에라도 넣어야하는데, 데이터를 storage에 넣는건 비추.
    onSuccess: (received: User | null) => {
      // 쿼리 함수가 성공적으로 실행됐을때 실행되는 함수, data를 파라미터로 받는다.
      if (!received) {
        clearStoredUser();
      } else {
        setStoredUser(received);
      }
    },
  });
  // 왼쪽 user와 오른쪽 user는 같은 변수이다. 기존의 user를 대입해서 새로운 userData를 불러오는것.

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
    // setQueryData로 키값에 해당하는 데이터를 업데이트한다.
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    queryClient.setQueryData(queryKeys.user, null);
    // 해당 키 값에 해당하는 데이터를 null로 저장시킨다.
  }

  return { user, updateUser, clearUser };
}
