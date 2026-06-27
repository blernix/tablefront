import { serverFetch } from '@/app/_lib/server-fetch';
import DashboardClient from './_components/DashboardClient';

export default async function DashboardPage() {
  const [restaurant, stats] = await Promise.all([
    serverFetch('/restaurant/me'),
    serverFetch('/restaurant/dashboard-stats'),
  ]);

  const now = Date.now();

  const restaurantJson = restaurant
    ? JSON.stringify({ state: { restaurant, lastFetched: now, lastServerUpdatedAt: (restaurant as any).updatedAt || null }, version: 0 })
    : null;
  const statsJson = stats
    ? JSON.stringify({ state: { stats, lastFetched: now }, version: 0 })
    : null;

  return (
    <>
      {restaurantJson && (
        <script
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.setItem('restaurant-storage','${restaurantJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}')}catch(e){}`,
          }}
        />
      )}
      {statsJson && (
        <script
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.setItem('dashboard-storage','${statsJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}')}catch(e){}`,
          }}
        />
      )}
      <DashboardClient />
    </>
  );
}

