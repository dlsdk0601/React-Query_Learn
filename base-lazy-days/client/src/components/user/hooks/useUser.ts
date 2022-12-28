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
  const { data: user } = useQuery(queryKeys.user, () => getUser(user));
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
