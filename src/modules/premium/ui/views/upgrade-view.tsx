"use client";

import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";

import { PricingCard } from "../components/pricing-card";

export const UpgradeView = () => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions(),
  );
  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );

  const onCheckout = async (productId: string) => {
    try {
      await authClient.checkout({ products: [productId] });
    } catch {
      toast.error("Could not start checkout. Please try again.");
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center gap-y-10 px-4 py-4 md:px-8">
        <EmptyState
          title="No plans available yet"
          description="Connect a Polar account (POLAR_ACCESS_TOKEN) and publish a recurring product to show plans here."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-y-10 px-4 py-4 md:px-8">
      <div className="mt-4 flex flex-1 flex-col items-center gap-y-10">
        <h5 className="text-2xl font-medium md:text-3xl">
          You are on the{" "}
          <span className="font-semibold text-primary">
            {currentSubscription?.name ?? "Free"}
          </span>{" "}
          plan
        </h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.map((product) => {
            const isCurrentProduct = currentSubscription?.id === product.id;
            const isPremium = !!currentSubscription;

            let buttonText = "Upgrade";
            let onClick: () => void = () => void onCheckout(product.id);

            if (isCurrentProduct) {
              buttonText = "Manage";
              onClick = () => void authClient.customer.portal();
            } else if (isPremium) {
              buttonText = "Change plan";
            }

            const price = product.prices[0];
            const amount =
              price && "priceAmount" in price
                ? Number(price.priceAmount) / 100
                : 0;

            return (
              <PricingCard
                key={product.id}
                buttonText={buttonText}
                onClick={onClick}
                variant={
                  product.metadata?.variant === "highlighted"
                    ? "highlighted"
                    : "default"
                }
                title={product.name}
                price={amount}
                description={product.description}
                priceSuffix={`/${product.recurringInterval ?? "month"}`}
                features={product.benefits.map(
                  (benefit) => benefit.description,
                )}
                badge={
                  product.metadata?.badge
                    ? String(product.metadata.badge)
                    : null
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const UpgradeViewLoading = () => (
  <LoadingState
    title="Loading"
    description="This may take a few seconds"
  />
);

export const UpgradeViewError = () => (
  <ErrorState title="Error" description="Something went wrong" />
);
