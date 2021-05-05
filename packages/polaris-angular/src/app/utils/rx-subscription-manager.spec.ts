import { Subscription } from "rxjs";
import { createManagedRxSubscriptions, ManagedRxSubscription } from "./rx-subscription-manager";

const getInnerSubscription = (managedSubscription: ManagedRxSubscription) =>
  managedSubscription.subscription;

const createTestManagedSubscription = (
  innerSubscription: Subscription | null = null
): ManagedRxSubscription => {
  const managedSubscription = new ManagedRxSubscription();

  // @ts-ignore - setting private field;
  managedSubscription.subscription = innerSubscription;

  return managedSubscription;
};

const createRxSubscriptionSpy = (): Subscription => {
  const subscription = new Subscription();
  spyOn(subscription, "unsubscribe");
  return subscription;
};

describe("Utils", () => {
  describe("ManagedRxSubscription", () => {
    it("should not fail when disposing with no inner subscription", () => {
      const managedSubscription = createTestManagedSubscription();

      managedSubscription.dispose();

      expect(getInnerSubscription(managedSubscription)).toBeNull();
    });

    it("should unsubscribe from inner subscription when disposing", () => {
      const innerSubscription = createRxSubscriptionSpy();
      const managedSubscription = createTestManagedSubscription(innerSubscription);

      managedSubscription.dispose();

      expect(getInnerSubscription(managedSubscription)).toBeNull();
      expect(innerSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it("should dispose previous inner subscription when manage is called", () => {
      const oldInnerSubscription = createRxSubscriptionSpy();
      const newRxSubscription = createRxSubscriptionSpy();
      const managedSubscription = createTestManagedSubscription(oldInnerSubscription);

      managedSubscription.manage(newRxSubscription);

      expect(getInnerSubscription(managedSubscription)).toBe(newRxSubscription);
      expect(oldInnerSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe("createManagedRxSubscriptions", () => {
    it("should create a managed subscription for each key in passed object", () => {
      const subscriptions = createManagedRxSubscriptions({
        s1: null,
        s2: null,
        s3: null,
      });

      expect(subscriptions.s1 instanceof ManagedRxSubscription).toBe(true);
      expect(subscriptions.s2 instanceof ManagedRxSubscription).toBe(true);
      expect(subscriptions.s3 instanceof ManagedRxSubscription).toBe(true);
    });

    it("should dispose all managed subscription", () => {
      const subscriptions = createManagedRxSubscriptions({
        s1: null,
        s2: null,
      });

      spyOn(subscriptions.s1, "dispose");
      spyOn(subscriptions.s2, "dispose");

      subscriptions.disposeAll();

      expect(subscriptions.s1.dispose).toHaveBeenCalledTimes(1);
      expect(subscriptions.s2.dispose).toHaveBeenCalledTimes(1);
    });
  });
});
