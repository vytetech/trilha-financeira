import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PRICE_TO_PLAN: Record<string, string> = {
  price_1TITp7QtN7BZ4FpXYApXlWli: "pro",
  price_1TITpbQtN7BZ4FpXKFAoXkHa: "ultimate",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Usar SERVICE_ROLE para verificar o JWT (suporta ES256)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError?.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      );
    }

    if (!user.email) throw new Error("User email not found");
    console.log("User authenticated:", user.email);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    // Sem customer = plano free
    if (customers.data.length === 0) {
      await supabaseAdmin
        .from("profiles")
        .update({ plan: "free" })
        .eq("user_id", user.id);
      return new Response(JSON.stringify({ subscribed: false, plan: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    console.log("Found customer:", customerId);

    const [activeSubs, trialingSubs] = await Promise.all([
      stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 5,
      }),
      stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 5,
      }),
    ]);

    const allSubs = [...activeSubs.data, ...trialingSubs.data];

    if (allSubs.length === 0) {
      await supabaseAdmin
        .from("profiles")
        .update({ plan: "free" })
        .eq("user_id", user.id);
      return new Response(JSON.stringify({ subscribed: false, plan: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Determinar o melhor plano ativo
    let bestPlan = "pro";
    let subscriptionEnd: string | null = null;

    for (const sub of allSubs) {
      const priceId = sub.items.data[0]?.price?.id;
      const detectedPlan = priceId ? PRICE_TO_PLAN[priceId] : null;
      console.log("Sub:", { status: sub.status, priceId, detectedPlan });

      if (detectedPlan === "ultimate") bestPlan = "ultimate";

      const endTs = sub.current_period_end || sub.trial_end;
      if (endTs && typeof endTs === "number") {
        subscriptionEnd = new Date(endTs * 1000).toISOString();
      }
    }

    console.log("Best plan:", bestPlan);
    await supabaseAdmin
      .from("profiles")
      .update({ plan: bestPlan })
      .eq("user_id", user.id);

    return new Response(
      JSON.stringify({
        subscribed: true,
        plan: bestPlan,
        subscription_end: subscriptionEnd,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CHECK-SUBSCRIPTION] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
