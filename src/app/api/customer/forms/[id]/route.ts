import { httpRequest } from "@/lib/http-request";
import { NextResponse, type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/api-base";
import { applyReseedCookies, browserCookieHeader, collectSetCookies, isSecureRequest, relayableSetCookies } from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import { seedPatientCsrf } from "@/lib/patient-auth/transport";

type Context = { params: Promise<{ id: string }> };
const noStore = { "Cache-Control": "private, no-store" };

async function forward(request: NextRequest, { params }: Context) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9_-]{1,160}$/.test(id)) {
    return NextResponse.json({}, { status: 400, headers: noStore });
  }
  const submit = request.method === "POST";
  if (submit && !request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({}, { status: 415, headers: noStore });
  }

  if (process.env.NODE_ENV === "development" && id === "local-demo") {
    if (submit) return NextResponse.json({ success: true }, { headers: noStore });
    return NextResponse.json({
      form: {
        title: "Formulaire de démonstration",
        description: "Utilisez des réponses fictives. Ce formulaire ne transmet aucune donnée au serveur Wenaya.",
        sections: [
          { title: "Votre visite", fields: [
            { id: "name", type: "shortAnswer", label: "Nom fictif", required: true },
            { id: "date", type: "date", label: "Date de votre visite", required: true },
          ] },
          { title: "Votre expérience", fields: [
            { id: "recommend", type: "yesNo", label: "Recommanderiez-vous cette visite ?", required: true },
            { id: "feedback", type: "longAnswer", label: "Commentaire" },
          ] },
        ],
      },
    }, { headers: noStore });
  }

  try {
    const body = submit ? await request.text() : undefined;
    const headers = new Headers({
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      company: request.headers.get("company") || "1",
    });
    const cookie = browserCookieHeader(request);
    const token = readXsrfHeaderFromCookie(request);
    if (cookie) headers.set("Cookie", cookie);
    if (token) headers.set("X-XSRF-TOKEN", token);
    if (submit) headers.set("Content-Type", "application/json");

    const fetchForm = () => httpRequest(
      getApiBaseUrl() + "/forms/" + encodeURIComponent(id) + (submit ? "/submit" : ""),
      { method: request.method, headers, body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12000) },
    );
    let upstream = await fetchForm();
    let refreshedCookies: string[] = [];
    if (submit && upstream.status === 419) {
      const refresh = await seedPatientCsrf(cookie);
      refreshedCookies = refresh.setCookies;
      const applied = applyReseedCookies(cookie, refreshedCookies);
      if (applied.cookieHeader) headers.set("Cookie", applied.cookieHeader);
      if (applied.xsrfToken) headers.set("X-XSRF-TOKEN", applied.xsrfToken);
      upstream = await fetchForm();
    }

    const payload = await upstream.json().catch(() => null);
    const response = NextResponse.json(payload ?? {}, {
      status: upstream.status === 204 && submit ? 200 : payload ? upstream.status : upstream.ok ? 502 : upstream.status,
      headers: noStore,
    });
    const cookies = [...refreshedCookies, ...collectSetCookies(upstream.headers)];
    for (const value of relayableSetCookies(cookies, isSecureRequest(request))) {
      response.headers.append("Set-Cookie", value);
    }
    return response;
  } catch {
    return NextResponse.json({}, { status: 502, headers: noStore });
  }
}

export const GET = forward;
export const POST = forward;
