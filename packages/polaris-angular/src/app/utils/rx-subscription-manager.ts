/* eslint-disable prefer-arrow/prefer-arrow-functions */
/**
 * RxJS subscriptions are automatically being managed by Angular when they are used in templates
 * using the async pipe.
 *
 * Most of the time we are subscribing to Observables inside the Angular component classes, which
 * need to be manually unsubscribed from when the component gets destroyed, or when the call gets
 * repeated before the previous call ended.
 *
 * These utils aim to make it easier to do that, while making things type-safe.
 *
 * @example
 *
 *    import { createManagedRxSubscriptions } from '@app/utils/rx-subscription-manager';
 *
 *    @Component({...})
 *    class MyComponent implements OnDestroy {
 *      private subscriptions = createManagedRxSubscriptions({
 *        getContracts: null,
 *        exportContracts: null,
 *      });
 *
 *      ngOnDestroy() {
 *        this.subscriptions.disposeAll();
 *      }
 *
 *      doSomething() {
 *        // The previous subscription is automatically disposed if it existed.
 *        // You can safely rely on the fact that all subscriptions defined when using
 *        // `createManagedRxSubscriptions`, like `getContracts`, will never be null.
 *
 *        this.subscriptions.getContracts.manage(
 *          this.service.getContracts().subscribe()
 *        );
 *
 *        // You can still manually dispose a subscription, but most of the time that won't be needed
 *        this.subscriptions.getContracts.dispose();
 *      }
 *    }
 */

import { Subscription } from "rxjs";

class ManagedRxSubscription {
  public subscription: Subscription | null = null;

  public manage(subscription: Subscription): ManagedRxSubscription {
    this.dispose();
    this.subscription = subscription;

    return this;
  }

  public dispose(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = null;
  }
}

export type RxSubscriptionManager<T extends Record<string, null>> = Readonly<
  Record<keyof T, ManagedRxSubscription> & {
    disposeAll(): void;
  }
>;

const createManagedRxSubscriptions = <T extends Record<string, null>>(
  subscriptions: T
): RxSubscriptionManager<T> => {
  const managedSubscriptions = Object.keys(subscriptions).reduce(
    (result, subscriptionName: keyof T) => {
      result[subscriptionName] = new ManagedRxSubscription();
      return result;
    },
    {} as Record<keyof T, ManagedRxSubscription>
  );

  return {
    // converts to any because TS <3.2 does not support spread of Record.
    ...(managedSubscriptions as any),
    disposeAll(): void {
      Object.keys(managedSubscriptions)
        .map((key) => managedSubscriptions[key])
        .forEach((subscription) => subscription.dispose());
    },
  };
};

export { createManagedRxSubscriptions, ManagedRxSubscription };
