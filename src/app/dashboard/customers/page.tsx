import { QueryClient, dehydrate } from '@tanstack/react-query';
import { serverFetch, getServerToken } from '@/app/_lib/server-fetch';
import QueryProvider from '@/providers/QueryProvider';
import CustomersClient from './_components/CustomersClient';

export default async function CustomersPage() {
  const token = getServerToken();
  const queryClient = new QueryClient();

  if (token) {
    await queryClient.prefetchQuery({
      queryKey: ['customers', { page: 1, limit: 20 }],
      queryFn: () => serverFetch<{ customers: unknown[] }>('/restaurant/customers?page=1&limit=20'),
    });
  }

  return (
    <QueryProvider dehydratedState={dehydrate(queryClient)}>
      <CustomersClient />
    </QueryProvider>
  );
}
