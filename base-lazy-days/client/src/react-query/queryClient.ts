import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      staleTime: 600000, // 10min
      cacheTime: 900000, // 15min, 데이터 유효 시간이 캐싱 저장 시간보다 길다는건 말이 안됨. 데이터 유효 시간을 기준으로 데이터를 다시 불러올텐데, 유효 시간이 더 길면 데이터가 없는 상태가 됨
      refetchOnMount: false, // 데이터가 stale 상태일 경우 마운트 될때마다 refetch를 실행하는 옵션,
      refetchOnWindowFocus: false, // 데이터가 stale 상태일 경우, 윈도우 포커싱될때마다 refetch하는 옵션
      refetchOnReconnect: false, // 데이터가 stale 상태일 경우, 재 연결이 될때 refetch하는 옵션
      // 사실 위와 같은 option은 좋지 않다. 유저가 제대로 된 데이터를 접하지 못할 수도 있기 떄문에
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});
