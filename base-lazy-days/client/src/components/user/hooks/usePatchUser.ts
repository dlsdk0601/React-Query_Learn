import jsonpatch from 'fast-json-patch';
import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): UseMutateFunction<
  User,
  unknown,
  User,
  unknown
> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const { mutate: patchUser } = useMutation(
    (newUserData: User) => patchUserOnServer(newUserData, user),
    {
      // onMutate returns context that is passed to onError
      // onMutate는 mutation 함수가 실행되기 직전에 실행되고, mutation 함수가 받을 동일한 변수가 전달
      onMutate: async (newData: User | null) => {
        // 유저 데이터에 대한 모든 발신 쿼리를 취소하여, 이전 서버 데이터가 optimistic update를 덮어쓰지 않도록 합니다.
        queryClient.cancelQueries(queryKeys.user);

        // 캐시에 있는것과 동일하게 기존 유저 값의 스냅샷을 찍는다.
        // queryClient 내장 함수로 getQueryData가 있는데, 이걸로 해당 쿼리 키에 해당 기존의 데이터를 가져올수 있다.
        // type을 User로 해주지 않으면, 나중에 onError에서 타입 에러가 뜸
        const previousUserData: User = queryClient.getQueryData(queryKeys.user);

        // optimistic update 를 캐시에 새로운 유저 데이터로 저장
        updateUser(newData);

        // return context object with snapshotted value
        return { previousUserData };
      },
      // 파라미터가 첫번째 부터, error, data, context인데
      // context는 onMutate에서 return 한 값이다.
      onError: (error, newData, context) => {
        // error가 났기 때문에 context로 전달받은 이전의 data값을 원복시킨다.
        if (context.previousUserData) {
          updateUser(context.previousUserData);
          toast({
            title: 'Update failed; restoring previous values',
            status: 'warning',
          });
        }
      },
      // onSuccess의 콜백함수는 queryFn함수의 return 값을 파라미터로 받는다.
      onSuccess: (userData: User | null) => {
        if (user) {
          // onMutate에서 처리 해줬기 때문에 onSuccess에서는 더이상 필요없다.
          // updateUser(userData);
          toast({
            title: 'User updated!',
            status: 'success',
          });
        }
      },
      // onSettled 는 mutate의 성공 여부와 관계없이, onSettled 콜백을 실행한다.
      onSettled: () => {
        // 유저 데이터에 대한 모든 쿼리 키를 무효화처리
        queryClient.invalidateQueries(queryKeys.user);
      },
    },
  );

  return patchUser;
}
