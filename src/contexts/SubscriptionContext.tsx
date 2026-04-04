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

export type PlanType = "free" | "pro" | "ultimate";

export const PLAN_LIMITS = {
  free: {
    tasks: 5,
    habits: 3,
    goals: 2,
    dreams: 3,
    investments: 5,
    transactions: 50,
  },
  pro: {
    tasks: 20,
    habits: 10,
    goals: 10,
    dreams: 10,
    investments: 20,
    transactions: 200,
  },
  ultimate: {
    tasks: Infinity,
    habits: Infinity,
    goals: Infinity,
    dreams: Infinity,
    investments: Infinity,
    transactions: Infinity,
  },
} as const;

export const PLAN_PRICES = {
  pro: {
    price_id: "price_1TIUBJQtN7BZ4FpXU9k2e2oG",
    product_id: "prod_UH2FNivRXJDDqv",
    monthly: 19.9,
  },
  ultimate: {
    price_id: "price_1TIUBVQtN7BZ4FpXEbNmnYHc",
    product_id: "prod_UH2FNivRXJDDqv",
    monthly: 39.9,
  },
} as const;

interface SubscriptionContextType {
  plan: PlanType;
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

  // Refs para evitar loop de chamadas
  const isFetchingRef = useRef(false);
  const lastCheckedUserRef = useRef<string | null>(null);

  const checkSubscription = useCallback(async () => {
    // Bloqueia chamada duplicada enquanto já está buscando
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

  // Roda apenas quando o user.id muda (login/logout)
  // Não depende do objeto session inteiro para evitar re-renders
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setPlan("free");
      setSubscribed(false);
      setSubscriptionEnd(null);
      lastCheckedUserRef.current = null;
      return;
    }

    // Evita chamar duas vezes para o mesmo usuário
    if (lastCheckedUserRef.current === user.id) return;
    lastCheckedUserRef.current = user.id;

    checkSubscription();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh a cada 5 minutos (aumentado de 1min para evitar spam)
  useEffect(() => {
    if (!user?.id || !session?.access_token) return;

    const interval = setInterval(
      () => {
        isFetchingRef.current = false; // libera para nova chamada
        checkSubscription();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [user?.id, session?.access_token]); // eslint-disable-line react-hooks/exhaustive-deps

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
