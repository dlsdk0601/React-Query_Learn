import { screen } from '@testing-library/react';
import { rest } from 'msw';

import { server } from '../../../mocks/server';
// import { defaultQueryClientOptions } from '../../../react-query/queryClient';
import { renderWithQueryClient } from '../../../test-utils';
import { Calendar } from '../Calendar';

// mocking useUser to mimic a logged-in user
// jest.mock('../../user/hooks/useUser', () => ({
//   __esModule: true,
//   useUser: () => ({ user: mockUser }),
// }));

test('Reserve appointment error', async () => {
  // (re)set handler to return a 500 error for appointments
  server.resetHandlers(
    rest.get(
      'http://localhost:3030/appointments/:month/:year',
      (req, res, ctx) => {
        return res(ctx.status(500));
      },
    ),
  );

  renderWithQueryClient(<Calendar />);

  // 달력 테스트 경우, error 발생시키고, 해당 toast모달창 잘뜨는지 테스트
  const alertToast = await screen.findByRole('alter');

  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});
