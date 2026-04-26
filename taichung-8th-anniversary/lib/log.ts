import { supabaseAdmin } from "./supabase";

function getTaipeiDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

export function writeLog(params: {
  event_type: string;
  user_id?: string | null;
  line_user_id?: string;
  display_name?: string;
  detail?: Record<string, unknown>;
  actor?: string;
}): void {
  void (async () => {
    try {
      await supabaseAdmin.from("activity_logs").insert({
        log_date: getTaipeiDate(),
        log_time: new Date().toISOString(),
        event_type: params.event_type,
        user_id: params.user_id ?? null,
        line_user_id: params.line_user_id ?? null,
        display_name: params.display_name ?? null,
        detail: params.detail ?? {},
        actor: params.actor ?? "system",
      });
    } catch (err) {
      console.error("[log]", err);
    }
  })();
}
