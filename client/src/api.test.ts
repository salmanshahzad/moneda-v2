import api, { APIError, APIResponse, Method } from "./api";

describe("api", () => {
  const endpoint = "foo";
  const url = `${process.env["API_URL"]}/${endpoint}`;
  const status = 200;
  const methods: Method[] = ["HEAD", "GET", "POST", "PATCH", "PUT", "DELETE"];
  const responseHeaders = [
    new Headers({ "Content-Type": "application/json" }),
    new Headers({ "Content-Type": "text/plain" }),
  ];
  const data = { foo: "bar" };

  it("makes the correct fetch request", async () => {
    for (const method of methods) {
      for (const headers of responseHeaders) {
        jest.spyOn(global, "fetch").mockResolvedValueOnce(
          new Response(JSON.stringify(data), {
            status,
            headers,
          })
        );

        let response: APIResponse | null = null;
        switch (method) {
          case "HEAD":
            response = await api.head(endpoint);
            break;
          case "GET":
            response = await api.get(endpoint);
            break;
          case "POST":
            response = await api.post(endpoint, data);
            break;
          case "PATCH":
            response = await api.patch(endpoint, data);
            break;
          case "PUT":
            response = await api.put(endpoint, data);
            break;
          case "DELETE":
            response = await api.delete(endpoint, data);
            break;
        }

        const request: RequestInit = {
          method,
          headers: { "Content-Type": "application/json" },
        };
        if (!["HEAD", "GET"].includes(method)) {
          request.body = JSON.stringify(data);
        }

        expect(fetch).toHaveBeenCalledWith(url, request);
        expect(response?.status).toBe(status);
        expect(response?.headers).toEqual(headers);
        if (headers.get("content-type") === "application/json") {
          expect(response?.data).toEqual(data);
        } else if (headers.get("content-type") === "text/plain") {
          expect(response?.data).toEqual(JSON.stringify(data));
        }
      }
    }
  });

  it("extracts error messages", () => {
    const errors: APIError[] = [
      {
        key: "foo",
        message: "bar",
      },
    ];
    expect(api.extractErrorMessages({ errors })).toEqual({
      foo: "bar",
    });
  });
});
