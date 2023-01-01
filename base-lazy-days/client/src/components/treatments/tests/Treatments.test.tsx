import { screen } from '@testing-library/react';

import { renderWithQueryClient } from '../../../test-utils';
import { Treatments } from '../Treatments';

test('renders response from query', () => {
  // write test here

  // 아래처럼 테스트 하면 실패한다. QueryClient가 없다고,
  // Treatments라는 컴포넌트 단독으로 테스트하기 때문에,
  // render(<Treatments />);

  // 그래서 custom해서 가져온다.
  renderWithQueryClient(<Treatments />);
});
