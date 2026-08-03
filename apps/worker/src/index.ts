import { Hono } from "hono";
import { apiKeyAuth } from "./middleware/auth";

export interface Env {
  DB: D1Database;
  APP_NAME: string;
  API_VERSION: string;
}

const app = new Hono<{ Bindings: Env }>();
app.use("*", async (c, next) => {

  await next();

  c.header(
    "Access-Control-Allow-Origin",
    "http://localhost:3000"
  );

  c.header(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );

  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

});
app.options("*", (c)=>{

  return new Response(null,{
    headers:{
      "Access-Control-Allow-Origin":"http://localhost:3000",
      "Access-Control-Allow-Methods":"GET,POST,OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type, Authorization"
    }
  });

});
// Health Check
app.get("/", (c) => {
  return c.json({
    success: true,
    app: c.env.APP_NAME,
    version: c.env.API_VERSION,
    timestamp: new Date().toISOString(),
  });
});

// Kiểm tra Database
app.get("/health", async (c) => {
  try {
    const result = await c.env.DB
      .prepare("SELECT COUNT(*) as total FROM accounts")
      .first();

    return c.json({
      success: true,
      database: "connected",
      accounts: result?.total ?? 0,
    });
  } catch (err) {
    return c.json(
      {
        success: false,
        error: String(err),
      },
      500
    );
  }
});
// ==============================
// MT5 Account Update API
// ==============================

app.post(
"/api/update",
apiKeyAuth,
async (c) => {
  try {

    const body = await c.req.json();

    const {
      login,
      broker,
      server,
      name,
      balance,
      equity,
      margin,
      free_margin,
      margin_level,
      leverage,
      currency,
      floating_profit
    } = body;


    if (!login) {
      return c.json({
        success:false,
        error:"Missing login"
      },400);
    }


    await c.env.DB
      .prepare(`
        INSERT INTO accounts (
          login,
          broker,
          server,
          name,
          balance,
          equity,
          margin,
          free_margin,
          margin_level,
          leverage,
          currency,
          floating_profit,
          connected,
          updated_at
        )

        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)

        ON CONFLICT(login)
        DO UPDATE SET

        broker=?,
        server=?,
        balance=?,
        equity=?,
        margin=?,
        free_margin=?,
        margin_level=?,
        leverage=?,
        floating_profit=?,
        connected=1,
        updated_at=?

      `)
      .bind(
        login,
        broker,
        server,
        name,
        balance,
        equity,
        margin,
        free_margin,
        margin_level,
        leverage,
        currency,
        floating_profit,
        1,
        new Date().toISOString(),

        broker,
        server,
        balance,
        equity,
        margin,
        free_margin,
        margin_level,
        leverage,
        floating_profit,
        new Date().toISOString()
      )
      .run();


    return c.json({
      success:true,
      message:"Account updated",
      login
    });


  } catch(error){

    return c.json({
      success:false,
      error:String(error)
    },500);

  }
});
// ==============================
// Get MT5 Accounts API
// ==============================

app.get("/api/accounts", async (c) => {

  try {

    const result = await c.env.DB
      .prepare(`
        SELECT *
        FROM accounts
        ORDER BY updated_at DESC
      `)
      .all();


    return c.json({
      success:true,
      total: result.results.length,
      accounts: result.results
    });


  } catch(error){

    return c.json({
      success:false,
      error:String(error)
    },500);

  }

});
export default app;