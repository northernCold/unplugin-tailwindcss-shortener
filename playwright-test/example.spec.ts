import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  const paths = [
    "",
    "dashboard",
    "ui-elements",
    "tables",
    "forms",
    "cards",
    "modal",
    "blank",
  ];

  for (const path of paths) {
    await page.goto(`/${path}`);
    await expect(page).toHaveScreenshot(`screenshot-${path}.png`, {
      fullPage: true,
      mask: [page.locator("img")],
    });
  }
});
