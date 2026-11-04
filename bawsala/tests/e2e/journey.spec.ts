import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PASSWORD = "e2e-password-123";
const uniq = () => `${Date.now()}${Math.floor(Math.random() * 1e4)}`;

async function setLocale(page: Page, locale: string) {
  await page.context().addCookies([{ name: "bawsala_locale", value: locale, url: page.url().startsWith("http") ? page.url() : "http://localhost:3100" }]);
}

async function signUp(page: Page, email: string, locale = "en") {
  await page.goto("/");
  await setLocale(page, locale);
  await page.goto("/signup");
  await page.getByLabel(/Full name|Nom/).fill("E2E Student");
  await page.getByLabel(/^Email/).fill(email);
  await page.getByLabel(/^Password/).fill(PASSWORD);
  await page.locator("input[name=consent]").check();
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/app/onboarding");
}

const consoleErrors: string[] = [];
test.beforeEach(async ({ page }) => {
  consoleErrors.length = 0;
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push(e.message));
});

test("full student journey: signup → onboarding → passport → path → assistant → persistence → export → delete @mobile", async ({ page, request }) => {
  const email = `e2e${uniq()}@test.local`;
  await signUp(page, email);

  // Onboarding
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Student", exact: true }).click();
  await page.getByLabel("Field of study").fill("Economics");
  await page.getByLabel("Level").selectOption("licence");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Family business" }).click();
  await page.getByLabel("What did you do?").fill("kansa3ed baba f7anout: kanbi3 l lklyan, kanhseb lflous f lkasa w kantb3 sel3a f Excel. Organisit nashat dyal nadi m3a fari9.");
  await page.getByRole("button", { name: "Find my skills" }).click();
  await expect(page.getByRole("heading", { name: "Here is what we found" })).toBeVisible({ timeout: 20_000 });
  const accept = page.getByRole("button", { name: "Yes, that’s me" });
  const n = await accept.count();
  expect(n).toBeGreaterThanOrEqual(3);
  for (let i = 0; i < n; i++) await accept.first().click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("input[name=target]").first().check();
  await page.getByRole("button", { name: "Go to my dashboard" }).click();
  await page.waitForURL(/\/app$/);
  await expect(page.getByText("Your next step")).toBeVisible();

  // Passport: states visible, demo label on opportunities
  await page.goto("/app/passport");
  await expect(page.getByText("Confirmed").first()).toBeVisible();
  await page.goto("/app/opportunities");
  await expect(page.getByText(/demo data from fictional organisations/)).toBeVisible();

  // Path from target opportunity
  await page.locator("a.opp-title").first().click();
  await page.getByRole("button", { name: "Create my path to this role" }).click();
  await page.waitForURL("**/app/plan");
  const firstCheck = page.locator(".task-check").first();
  await firstCheck.click();
  await expect(page.getByText(/1 of \d+ steps/)).toBeVisible();

  // Assistant (basic engine without API key): skills, opportunities, knowledge with citations, plan confirmation
  await page.goto("/app/assistant");
  await expect(page.getByText("Basic mode (no AI model connected)")).toBeVisible();
  await page.getByLabel(/Message the assistant/).fill("Which roles fit me best?");
  await page.keyboard.press("Enter");
  await expect(page.locator(".msg .md table")).toBeVisible({ timeout: 20_000 });
  await page.getByLabel(/Message the assistant/).fill("How does ANAPEC work?");
  await page.keyboard.press("Enter");
  await expect(page.locator(".cite").last()).toContainText("ANAPEC", { timeout: 20_000 });
  await page.getByLabel(/Message the assistant/).fill("Make me a 30-day plan");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Save this path" }).click();
  await expect(page.getByText("Saved to your path")).toBeVisible();
  const convUrl = page.url();
  expect(convUrl).toMatch(/\/app\/assistant\/[0-9a-f-]{36}$/);

  // Logout → login → conversation persisted
  await page.context().clearCookies();
  await page.goto("/app");
  await page.waitForURL("**/signin**");
  await page.getByLabel(/^Email/).fill(email);
  await page.getByLabel(/^Password/).fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/app$/);
  await page.goto(convUrl);
  await expect(page.locator(".msg-user")).toHaveCount(3);

  // Export & delete
  const exp = await page.request.get("/api/v1/me/export");
  const data = await exp.json();
  expect(data.skills.length).toBeGreaterThanOrEqual(3);
  expect(data.conversations.length).toBe(1);
  await page.goto("/app/settings");
  await page.getByRole("button", { name: "Delete my account" }).click();
  await page.getByLabel("Type your password to confirm").fill(PASSWORD);
  await page.locator("dialog[open]").getByRole("button", { name: "Delete my account" }).click();
  await page.waitForURL("**/");
  const relog = await request.post("/api/v1/auth/signin", { data: { email, password: PASSWORD }, headers: { Origin: "http://localhost:3100" } });
  expect(relog.status()).toBe(401);
  expect(consoleErrors.filter((e) => !/Failed to load resource.*401/.test(e))).toEqual([]);
});

test("Arabic is RTL, Darija RTL, Tamazight renders Tifinagh LTR with the Tifinagh font", async ({ page }) => {
  await page.goto("/");
  for (const [loc, dir, lang] of [["ar", "rtl", "ar"], ["ary", "rtl", "ary"], ["zgh", "ltr", "zgh-Tfng"], ["fr", "ltr", "fr"]] as const) {
    await setLocale(page, loc);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("dir", dir);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${loc} horizontal overflow`).toBeLessThanOrEqual(0);
  }
  await setLocale(page, "zgh");
  await page.goto("/");
  const h1 = await page.locator("h1").innerText();
  expect(h1).toMatch(/[ⴰ-⵿]/);
  expect(await page.evaluate(() => document.fonts.check('16px "Noto Sans Tifinagh"', "ⴱⴰⵡⵙⴰⵍⴰ"))).toBe(true);
});

/**
 * Waits until every finite CSS animation/transition has finished, so the accessibility scan measures
 * the page the student actually reads, not a frame in the middle of an entrance fade (semi-transparent
 * text would be reported as low contrast). Infinite decorative loops (twinkling stars) are ignored.
 * The axe rules, tags and the zero-violation threshold are unchanged.
 */
async function settle(page: import("@playwright/test").Page) {
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity), undefined, { timeout: 10_000 });
}

test("accessibility: no serious or critical axe violations on key pages", async ({ page }) => {
  const email = `a11y${uniq()}@test.local`;
  await signUp(page, email);
  const results: Record<string, string[]> = {};
  for (const path of ["/", "/signin", "/app/onboarding", "/app", "/app/passport", "/app/opportunities", "/app/assistant", "/app/settings"]) {
    await page.goto(path);
    await settle(page);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    results[path] = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id} (${v.nodes.length})`);
  }
  console.log("[a11y]", JSON.stringify(results));
  expect(Object.values(results).flat()).toEqual([]);
});

test("authorization boundaries over HTTP: other students, institution and admin areas", async ({ page, browser }) => {
  const a = `ida${uniq()}@test.local`;
  await signUp(page, a);
  const conv = await page.request.post("/api/v1/conversations", { data: { title: "secret" }, headers: { Origin: "http://localhost:3100" } });
  const convId = (await conv.json()).id;
  const ctxB = await browser.newContext();
  const pageB = await ctxB.newPage();
  await signUp(pageB, `idb${uniq()}@test.local`);
  const H = { Origin: "http://localhost:3100" };
  expect((await pageB.request.get(`/api/v1/conversations/${convId}`)).status()).toBe(404);
  expect((await pageB.request.delete(`/api/v1/conversations/${convId}`, { headers: H })).status()).toBe(404);
  expect((await pageB.request.get("/api/v1/admin/overview")).status()).toBe(403);
  expect((await pageB.request.get("/api/v1/institution/stats")).status()).toBe(403);
  await pageB.goto("/admin");
  await expect(pageB).toHaveURL(/\/app$/);
  // CSRF: a cross-origin POST with the victim's cookie is rejected
  expect((await pageB.request.post("/api/v1/conversations", { data: {}, headers: { Origin: "https://evil.example" } })).status()).toBe(403);
  // Unauthenticated
  expect((await (await browser.newContext()).request.get("http://localhost:3100/api/v1/passport")).status()).toBe(401);
  await ctxB.close();
});
