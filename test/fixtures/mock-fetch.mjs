/** Return request metadata to the stdio integration test without any network access. */
globalThis.fetch = async (url, init) => {
  const body = init.body ? JSON.parse(init.body) : undefined;
  const request = { url, method: init.method, body, ...(init.headers["Idempotency-Key"] ? { idempotencyKey: init.headers["Idempotency-Key"] } : {}) };
  if (body?.kind === "subsequence") return new Response(JSON.stringify({ id: 77, ...request }));
  return new Response(JSON.stringify(request));
};
