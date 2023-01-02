import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockUser } from '../../../mocks/mockData';
import { renderWithQueryClient } from '../../../test-utils';
import { Calendar } from '../Calendar';

// mutate에 대한 테스트 코트는 성공 토스트 모달을 잘 받아오냐로 판별한다.
// 사실 실제로 데이터가 바뀌는지 확인해야하지만, 강의에서는 거기까지 알려주지않는다.

// mocking useUser to mimic a logged-in user
jest.mock('../../user/hooks/useUser', () => ({
  __esModule: true,
  useUser: () => ({ user: mockUser }),
}));

test('Reserve appointment', async () => {
  renderWithQueryClient(
    <MemoryRouter>
      <Calendar />
    </MemoryRouter>,
  );

  // find all the appointments
  // screen은 화면단에서 찾는거임 아마 html로 찾을듯
  const appointments = await screen.findAllByRole('button', {
    name: /\d\d? [ap]m\s+(scrub|facial|massage)/i,
  });

  // click on the first one to reserve
  fireEvent.click(appointments[0]);

  // check for the toast alert
  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('reserve');

  // close alert to keep state clean and wait for it to disappear
  const alertCloseButton = screen.getByRole('button', { name: 'Close' });
  alertCloseButton.click();
  await waitForElementToBeRemoved(alertToast);
});

test('Cancel appointment', async () => {
  renderWithQueryClient(
    <MemoryRouter>
      <Calendar />
    </MemoryRouter>,
  );

  const cancelButtons = await screen.findAllByRole('button', {
    name: /cancel appointment/i,
  });

  // 첫 번째 취소 버튼 클릭
  // fireEvent로 클릭하는 이유는, 원래 클릭하면 데이터 변화가 일어나야하는 버튼이라서 fireEvent로 클릭
  fireEvent.click(cancelButtons[0]);

  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('cancel');

  const alertCloseButton = screen.getByRole('button', { name: 'Close' });

  // 모달창 닫는 버튼 클릭
  alertCloseButton.click();
  await waitForElementToBeRemoved(alertToast);
});
