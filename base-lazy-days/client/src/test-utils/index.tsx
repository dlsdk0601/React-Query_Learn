import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { defaultQueryClientOptions } from '../react-query/queryClient';

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks

// test를 위한 고유한 queryCLient 만들기
const generateQueryClient = () => {
  return new QueryClient();
};

export function renderWithQueryClient(
  ui: ReactElement,
  client?: QueryClient,
): RenderResult {
  // 특정 queryClient를 받아서 사용하던가, 새로 만들던가
  const queryClient = client ?? generateQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

// export const createQueryClientWrapper = (): React.FC => {
//   const queryClient = generateQueryClient();
//   return ({ children }) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };
