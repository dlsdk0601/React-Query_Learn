import { act, renderHook } from '@testing-library/react-hooks';

import { createQueryClientWrapper } from '../../../test-utils';
import { useAppointments } from '../hooks/useAppointments';

test('filter appointments by availability', async () => {
  // result는 hook의 결과를 포함한 객체
  // wairFor는 hook의 비동기 액션을 기다릴수 있게 하는 역할
  const { result, waitFor } = renderHook(useAppointments, {
    wrapper: createQueryClientWrapper(),
  });

  // appointments가 업데이트 되길 기다리기
  // result.current useAppointment가 반환한 객체
  await waitFor(() => Object.keys(result.current.appointments).length > 0);

  const filteredAppointmentsLength = Object.keys(result.current.appointments)
    .length;

  act(() => result.current.setShowAll(true));

  await waitFor(
    () =>
      Object.keys(result.current.appointments).length >
      filteredAppointmentsLength,
  );
});
