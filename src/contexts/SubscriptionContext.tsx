import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type PlanType =
  | "free"
  | "pro_monthly"
  | "pro_yearly"
  | "ultimate_monthly"
  | "ultimate_yearly";

export const PLAN_LIMITS = {
  free: {
    tasks: 5,
    habits: 3,
    goals: 2,
    dreams: 3,
    investments: 5,
    transactions: 50,
  },
  pro_monthly: {
    tasks: 20,
    habits: 10,
    goals: 10,
    dreams: 10,
    investments: 20,
    transactions: 200,
  },
  pro_yearly: {
    tasks: 20,
    habits: 10,
    goals: 10,
    dreams: 10,
    investments: 20,
    transactions: 200,
  },
  ultimate_monthly: {
    tasks: Infinity,
    habits: Infinity,
    goals: Infinity,
    dreams: Infinity,
    investments: Infinity,
    transactions: Infinity,
  },
  ultimate_yearly: {
    tasks: Infinity,
    habits: Infinity,
    goals: Infinity,
    dreams: Infinity,
    investments: Infinity,
    transactions: Infinity,
  },
} as const;

export const PLAN_PRICES = {
  pro_monthly: {
    price_id: "price_1TIUBJQtN7BZ4FpXU9k2e2oG",
    monthly: 19.9,
  },
  pro_yearly: {
    price_id: "price_1TMGaXQtN7BZ4FpXivhO1rYU",
    yearly: 199.9,
  },
  ultimate_monthly: {
    price_id: "price_1TIUBVQtN7BZ4FpXEbNmnYHc",
    monthly: 39.9,
  },
  ultimate_yearly: {
    price_id: "price_1TMGbgQtN7BZ4FpXLAGPKcdT",
    yearly: 399.9,
  },
} as const;

export function getPlanFamily(plan: PlanType): "free" | "pro" | "ultimate" {
  if (plan.startsWith("ultimate")) return "ultimate";
  if (plan.startsWith("pro")) return "pro";
  return "free";
}

export function isPaidPlan(plan: PlanType): boolean {
  return plan !== "free";
}

interface SubscriptionContextType {
  plan: PlanType;
  planFamily: "free" | "pro" | "ultimate";
  subscribed: boolean;
  subscriptionEnd: string | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  canCreate: (
    resource: keyof typeof PLAN_LIMITS.free,
    currentCount: number,
  ) => boolean;
  getLimit: (resource: keyof typeof PLAN_LIMITS.free) => number;
  getRemainder: (
    resource: keyof typeof PLAN_LIMITS.free,
    currentCount: number,
  ) => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [plan, setPlan] = useState<PlanType>("free");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isFetchingRef = useRef(false);
  const lastCheckedUserRef = useRef<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (isFetchingRef.current) return;

    const accessToken = session?.access_token;
    if (!accessToken) {
      setLoading(false);
      return;
    }

    isFetchingRef.current = true;

    try {
      const { data, error } =
        await supabase.functions.invoke("check-subscription");

      if (!error && data) {
        setPlan(data.plan || "free");
        setSubscribed(data.subscribed || false);
        setSubscriptionEnd(data.subscription_end || null);
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setPlan("free");
      setSubscribed(false);
      setSubscriptionEnd(null);
      lastCheckedUserRef.current = null;
      return;
    }

    if (lastCheckedUserRef.current === user.id) return;
    lastCheckedUserRef.current = user.id;

    checkSubscription();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.id || !session?.access_token) return;

    const interval = setInterval(
      () => {
        isFetchingRef.current = false;
        checkSubscription();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [user?.id, session?.access_token]); // eslint-disable-line react-hooks/exhaustive-deps

  const planFamily = getPlanFamily(plan);

  const canCreate = (
    resource: keyof typeof PLAN_LIMITS.free,
    currentCount: number,
  ): boolean => {
    return currentCount < PLAN_LIMITS[plan][resource];
  };

  const getLimit = (resource: keyof typeof PLAN_LIMITS.free): number => {
    return PLAN_LIMITS[plan][resource];
  };

  const getRemainder = (
    resource: keyof typeof PLAN_LIMITS.free,
    currentCount: number,
  ): number => {
    const limit = PLAN_LIMITS[plan][resource];
    if (limit === Infinity) return Infinity;
    return Math.max(0, limit - currentCount);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        planFamily,
        subscribed,
        subscriptionEnd,
        loading,
        checkSubscription,
        canCreate,
        getLimit,
        getRemainder,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context)
    throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
}
