import { RequestOptions, RequestPayload } from "../../types/types";
import { config } from "../api/config";

export async function postRequest<T>(
  url: string,
  payload: RequestPayload,
  options?: RequestOptions
): Promise<T> {
  const timeout = options?.timeout ?? 10000;
  const controller = new AbortController();

  // Abortamos la request si se supera el timeout definido
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...options?.headers, // Permite sobreescribir o agregar headers externos
    };

    // Solo agregamos Content-Type si no es FormData
    if (!(payload instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Agregamos token si se pasa en options
    if (options?.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    const res = await fetch(`${config.apiUrl}${url}`, {
      method: "POST",
      headers,
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store", // Evita cachear respuestas
    });

    clearTimeout(timeoutId);

    const json = await res.json().catch(() => null); // Evita que fallo de parse rompa la request

    if (!res.ok) {
      throw new Error(json?.message || "Request failed"); // Mensaje de error del backend si existe
    }

    return json;
  } catch (err: any) {
    clearTimeout(timeoutId);

    // Detecta timeout de red
    if (err.name === "AbortError") throw new Error("Network timeout");
    
    throw err;
  }
}
