// src/app/api/notificar/route.ts

import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  "mailto:suporte@nordicdesk.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, corpo } = body;

    const { data: inscricoes, error } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (error || !inscricoes) {
      return NextResponse.json(
        { error: "Erro ao ler inscrições" },
        { status: 500 },
      );
    }

    const payload = JSON.stringify({
      title: titulo,
      body: corpo,
      url: "/dashboard",
    });

    const promessas = inscricoes.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      // O Carteiro tenta entregar. Se der erro 410, ele apaga o endereço do banco!
      return webpush
        .sendNotification(pushSubscription, payload)
        .catch(async (err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log(
              "🗑️ Endereço expirado encontrado. Deletando do banco...",
            );
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", sub.endpoint);
          } else {
            console.error("Erro desconhecido no Web Push:", err);
          }
        });
    });

    await Promise.all(promessas);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro na API de notificação:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
