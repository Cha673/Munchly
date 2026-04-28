import { expect, test } from "@nuxt/test-utils/playwright";

test.describe("Parcours d'un admin", () => {
  test("un admin, peut se connecter, ajouter un restaurateur ", async ({
    page,
  }) => {
    // 1. Connexion de l'utilisateur
    await page.goto("/login");
    await page.fill("input[type=email]", "test_admin@example.com");
    await page.fill("input[type=password]", "admin123");
    await page.click("button");

    await page.waitForURL("**/admin");
    console.log("Current URL:", page.url());

    await page.click(".add-button");
    console.log("Current URL:", page.url());

    await page.waitForURL("**/admin/add-restaurateur");
    await page.fill("input[type=text]", "admin_test");
    await page.fill("input[type=email]", "admin_test@example.com");
    await page.fill("input[type=password]", "admin123");
    await page.click("button[type=submit]");

    await page.waitForURL("**/admin");
    await page.waitForSelector(".users-list .user-card .user-info h3 ");
    await expect(
      page.locator(
        ".users-list .user-card .user-info h3:has-text('test_resto1')"
      )
    ).toBeVisible({ timeout: 10000 });
  });
});
