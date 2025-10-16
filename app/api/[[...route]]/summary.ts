import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { z } from "zod"
import { zValidator } from "@hono/zod-validator";
import { subDays, parse, differenceInDays } from "date-fns";
import { db } from "@/db/drizzle";
import { and, eq, gte, lte, lt, sql, desc } from "drizzle-orm";
import { accounts, categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillEmptyDays } from "@/lib/utils";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;
      const periodLength = differenceInDays(endDate, startDate) + 1;

      // the start and end dates of the last period, 
      // for comparing the current period
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(
        userId: string,
        startDate: Date,
        endDate: Date,
      ) {
        return await db
          .select({
            income: sql`COALESCE(SUM(
              CASE 
                WHEN ${transactions.amount} >= 0 THEN ${transactions.amount}
                ELSE 0
              END
              ), 0)`.mapWith(Number),
            expenses: sql`COALESCE(SUM(
              CASE 
                WHEN ${transactions.amount} < 0 THEN ${transactions.amount}
                ELSE 0
              END
              ), 0)`.mapWith(Number),
            remaining: sql`COALESCE(SUM(${transactions.amount}), 0)`.mapWith(Number),
          })
          .from(transactions)
          .innerJoin(
            accounts,
            eq(
              transactions.accountId,
              accounts.id
            )
          )
          .where(
            and(
              accountId ? eq(transactions.accountId, accountId) : undefined,
              eq(accounts.userId, userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate)
            )
          )
      }

      const [currentPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate
      );
      const [lastPeriod] = await fetchFinancialData(
        auth.userId,
        lastPeriodStart,
        lastPeriodEnd
      );
      const incomeChange = calculatePercentageChange(
        currentPeriod.income,
        lastPeriod.income
      );
      const expensesChange = calculatePercentageChange(
        currentPeriod.expenses,
        lastPeriod.expenses
      );
      const remainingChange = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining
      );

      const category = await db
        .select({
          name: categories.name,
          value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
        })
        .from(transactions)
        .innerJoin(
          accounts,
          eq(transactions.accountId, accounts.id)
        )
        .innerJoin(
          categories,
          eq(
            transactions.categoryId,  // NOTE 这里不是 leftjoin，为了应对 category 为 undefined 的情况
            categories.id
          )
        )
        .where(
          and(
              accountId ? eq(transactions.accountId, accountId) : undefined,
              eq(accounts.userId, auth.userId),
              lt(transactions.amount, 0),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate)
            )
        )
        .groupBy(categories.name)
        .orderBy(desc(
          sql`SUM(ABS(${transactions.amount}))`
        ));

      const topCategories = category.slice(0, 3);
      const otherCategories = category.slice(3);
      const otherSum = otherCategories.reduce((sum, current) => sum + current.value, 0);

      const finalCategories = topCategories;
      if (otherCategories.length > 0) {
        // only if we have more than 3 categories, we need to add "Other"
        finalCategories.push({
          name: "Other",
          value: otherSum
        })
      }

      const activeDays = await db
        .select({
          date: transactions.date,
          income: sql`SUM(
            CASE 
              WHEN ${transactions.amount} >= 0 
              THEN ${transactions.amount}
              ELSE 0
            END
            )`.mapWith(Number),
          expenses: sql`SUM(
            CASE 
              WHEN ${transactions.amount} < 0 
              THEN ABS(${transactions.amount})
              ELSE 0
            END
            )`.mapWith(Number)
        })
        .from(transactions)
        .innerJoin(
          accounts,
          eq(
            transactions.accountId,
            accounts.id
          )
        )
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .groupBy(transactions.date)
        .orderBy(transactions.date)

      // NOTE why doing this in backend? will add payload.
      const days = fillEmptyDays(
        activeDays,
        startDate,
        endDate
      )
      
      return c.json({
        data: {
          remainingAmount: currentPeriod.remaining,
          remainingChange,
          incomeAmount: currentPeriod.income,
          incomeChange,
          expensesAmount: currentPeriod.expenses,
          expensesChange,
          categories: finalCategories,
          days,
        }
      })
    }
  )

export default app;