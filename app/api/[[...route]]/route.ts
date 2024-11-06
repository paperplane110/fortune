import { z } from "zod";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"

export const runtime = "edge";

const app = new Hono().basePath("/api")

app.use("*", clerkMiddleware())
app.get("/hello", (c) => {
        const auth = getAuth(c)
        if (!auth?.userId) {
            return c.json({
                message: "You need to login"
            })
        }
        return c.json({
            message: `Hello! ${auth.userId}` 
        })
    })
    .get(
        "/hello/:test", 
        zValidator("param", z.object({
            test: z.string(),
        })),
        (c) => {
        return c.json({
            message: "hello",
            test: c.req.valid("param").test,
        })
    })

export const GET = handle(app)
export const POST = handle(app)
