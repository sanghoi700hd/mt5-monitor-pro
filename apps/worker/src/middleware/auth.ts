import type { Context, Next } from "hono";

export async function apiKeyAuth(
  c: Context,
  next: Next
) {

  const auth = c.req.header("Authorization");

  if (!auth) {
    return c.json({
      success:false,
      error:"Missing Authorization header"
    },401);
  }


  const key = auth.replace("Bearer ","");


  const result = await c.env.DB
    .prepare(`
      SELECT *
      FROM api_keys
      WHERE api_key = ?
      AND active = 1
    `)
    .bind(key)
    .first();


  if (!result) {
    return c.json({
      success:false,
      error:"Invalid API Key"
    },401);
  }


  await next();
}