import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// mutate 의 type은 UseMutateFunction으로 처리 할 수 있다.
// UseMutateFunction<TData, TError, TVariable, TContext>
// TData: mutation function 의 리턴되는 데이터 타입
// TError: 에러 타입
// TVariables: mutate function의 변수 타입
// TContext: context type

export function useReserveAppointment(): UseMutateFunction<
  void,
  unknown,
  Appointment,
  unknown
> {
  const { user } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (appointment: Appointment) => setAppointmentUser(appointment, user?.id),
    {
      onSuccess: () => {
        // 쿼리 데이터 무효화 내장 함수
        // queryKeys.appointment로 시작하는 쿼리키(preFix)와 관련된 모든 데이터 무효화
        // 쿼리키 배열에 queryKeys.appointments가 포함된 모든 쿼리 데이터는 무효화
        // 정확하게는 쿼리가 오래된것이라고 알리는 내장함수이고, react-query는 리패칭 해온다.
        queryClient.invalidateQueries([queryKeys.appointments]);
        toast({
          title: 'You have reserved the appointment!',
          status: 'success',
        });
      },
    },
  );

  // TODO: replace with mutate function
  return mutate;
}
