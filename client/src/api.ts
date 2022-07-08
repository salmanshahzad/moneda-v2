export type Method = "HEAD" | "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface APIResponse {
  status: number;
  headers: Headers;
  data: unknown;
}

export interface APIError {
  key: string;
  message: string;
}

const api = {
  async head(endpoint: string): Promise<APIResponse> {
    return await _fetch(endpoint, "HEAD");
  },
  async get(endpoint: string): Promise<APIResponse> {
    return await _fetch(endpoint, "GET");
  },
  async post(endpoint: string, data?: unknown): Promise<APIResponse> {
    return await _fetch(endpoint, "POST", data);
  },
  async patch(endpoint: string, data?: unknown): Promise<APIResponse> {
    return await _fetch(endpoint, "PATCH", data);
  },
  async put(endpoint: string, data?: unknown): Promise<APIResponse> {
    return await _fetch(endpoint, "PUT", data);
  },
  async delete(endpoint: string, data?: unknown): Promise<APIResponse> {
    return await _fetch(endpoint, "DELETE", data);
  },
  extractErrorMessages(data: unknown): Record<string, string> {
    const { errors } = data as { errors: APIError[] };
    return errors.reduce(
      (errors, error) => ({
        ...errors,
        [error.key]: error.message,
      }),
      {}
    );
  },
};

async function _fetch(
  endpoint: string,
  method: Method,
  data?: unknown
): Promise<APIResponse> {
  const request: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  if (typeof data !== "undefined") {
    request.body = JSON.stringify(data);
  }

  const response = await fetch(
    `${process.env["API_URL"]}/${endpoint}`,
    request
  );
  const { status, headers } = response;

  if (headers.get("content-type")?.includes("application/json")) {
    const json = await response.json();
    return { status, headers, data: json };
  }

  const text = await response.text();
  return { status, headers, data: text };
}

export default api;
