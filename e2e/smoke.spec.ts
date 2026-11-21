import { expect, test } from "@playwright/test";

test("첫 화면에 가족 로그인 제목이 보인다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/70년산 명품엄마/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "70년산"
  );
});
