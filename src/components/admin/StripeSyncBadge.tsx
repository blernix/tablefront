'use client';

import { Badge } from '@/components/ui/badge';
import { Restaurant } from '@/types';
import { Check, X, AlertCircle } from 'lucide-react';

interface StripeSyncBadgeProps {
  restaurant: Restaurant;
  className?: string;
}

export function StripeSyncBadge({ restaurant, className }: StripeSyncBadgeProps) {
  const hasStripeSubscription = !!restaurant.subscription?.stripeSubscriptionId;
  const hasStripeCustomer = !!restaurant.subscription?.stripeCustomerId;
  const accountType = restaurant.accountType;

  // Managed accounts don't have Stripe subscriptions
  if (accountType === 'managed') {
    return (
      <Badge variant="outline" className={className}>
        <span className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Managed
        </span>
      </Badge>
    );
  }

  // Self-service accounts
  if (!hasStripeSubscription) {
    return (
      <Badge variant="warning" className={className}>
        <span className="flex items-center gap-1">
          <X className="h-3 w-3" />
          No Stripe
        </span>
      </Badge>
    );
  }

  // Has Stripe subscription
  return (
    <Badge variant="success" className={className}>
      <span className="flex items-center gap-1">
        <Check className="h-3 w-3" />
        Stripe
      </span>
    </Badge>
  );
}
