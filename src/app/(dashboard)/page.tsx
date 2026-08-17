import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  HomeView,
  HomeViewError,
  HomeViewLoading,
} from "@/modules/home/ui/views/home-view";

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({ pageSize: 5 }),
  );
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 5 }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<HomeViewLoading />}>
        <ErrorBoundary fallback={<HomeViewError />}>
          <HomeView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
