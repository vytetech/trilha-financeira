import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PLAN_PRICES: Record<string, string> = {
  pro: "price_1TIUBJQtN7BZ4FpXU9k2e2oG",
  ultimate: "price_1TIUBVQtN7BZ4FpXEbNmnYHc",
};

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!supabaseUrl) throw new Error("SUPABASE_URL is not set");
    if (!serviceRole) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

    // 🔥 PEGAR HEADER
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

    // 🔥 FIX PRINCIPAL (aceita Bearer/bearer/etc)
    const token = authHeader.replace(/Bearer\s+/i, "").trim();

    if (!token) {
      return new Response(JSON.stringify({ error: "Invalid token format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // 🔐 CLIENT ADMIN
    const supabaseAdmin = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 🔥 VALIDAR USUÁRIO
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError?.message);
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          details: authError?.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      );
    }

    if (!user.email) {
      throw new Error("User email not found");
    }

    console.log("✅ User:", user.email);

    // 📦 BODY
    const body = await req.json().catch(() => ({}));
    const planKey = body.plan || "pro";

    const priceId = PLAN_PRICES[planKey];

    if (!priceId) {
      throw new Error(`Invalid plan: ${planKey}`);
    }

    // 💳 STRIPE
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // 🔁 BUSCAR CUSTOMER EXISTENTE
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Existing customer:", customerId);
    }

    const origin = req.headers.get("origin") || "http://localhost:5173";

    // 🚀 CRIAR CHECKOUT
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      mode: "subscription",

      success_url: `${origin}/settings?tab=plano&success=true`,
      cancel_url: `${origin}/settings?tab=plano`,

      // 🔥 IMPORTANTE PRA WEBHOOK FUTURO
      metadata: {
        user_id: user.id,
        plan: planKey,
      },
    });

    console.log("✅ Checkout criado:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);

    console.error("❌ ERROR:", msg);

    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
