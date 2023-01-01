import { screen } from '@testing-library/react';

import { renderWithQueryClient } from '../../../test-utils';
import { Treatments } from '../Treatments';

test('renders response from query', async () => {
  // write test here

  // 아래처럼 테스트 하면 실패한다. QueryClient가 없다고,
  // Treatments라는 컴포넌트 단독으로 테스트하기 때문에,
  // render(<Treatments />);

  // 그래서 custom해서 가져온다.
  renderWithQueryClient(<Treatments />);

  // heading은 해당 테스트의 제목
  // option에 들어간 내용중 name은 API res에 name이라는 필드 찾아서, 해당 내용이 포함됐는지를 확인.
  const treatmentTitles = await screen.findAllByRole('heading', {
    name: /massage|facial|scrub/i,
  });

  // true가 3개 나온건지 확인
  expect(treatmentTitles).toHaveLength(3);
});
