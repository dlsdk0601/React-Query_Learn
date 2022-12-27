import { useQuery, useQueryClient } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const fallBack = [];
  const { data = fallBack } = useQuery(queryKeys.treatments, getTreatments, {
    staleTime: 600000, // 10min
    cacheTime: 900000, // 15min, 데이터 유효 시간이 캐싱 저장 시간보다 길다는건 말이 안됨. 캐싱 저장 시간을 기준으로 데이터를 다시 불러올텐데, 유효 시간이 더 길면 데이터가 없는 상태가 됨
    refetchOnMount: false, // 데이터가 stale 상태일 경우 마운트 될때마다 refetch를 실행하는 옵션,
    refetchOnWindowFocus: false, // 데이터가 stale 상태일 경우, 윈도우 포커싱될때마다 refetch하는 옵션
    refetchOnReconnect: false, // 데이터가 stale 상태일 경우, 재 연결이 될때 refetch하는 옵션
  });

  return data;
}

export const usePrefetchTreatments = (): void => {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments);
};
