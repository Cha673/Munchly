import { expect, test } from "@nuxt/test-utils/playwright";

test.describe("Parcours d'un restaurateur", () => {
  test("un restaurateur, peut se connecter, ajouter un plat, voir ses commandes ", async ({
    page,
  }) => {
    // 1. Connexion de l'utilisateur
    await page.goto("/login");
    await page.fill("input[type=email]", "test1_restaurateur@example.com");
    await page.fill("input[type=password]", "resto123");
    await page.click("button");

    await page.waitForURL("**/restaurateur");
    console.log("Current URL:", page.url());

    await page.click(".quick-actions .action-card:nth-of-type(1)");
    console.log("Current URL:", page.url());

    await page.waitForURL("**/restaurateur/plats");
    await page.click(".add-button");

    console.log("Current URL:", page.url());
    await page.waitForURL("**/restaurateur/add_plat");

    await page.fill("input[type=text]", "nom plat test");
    await page.fill("textarea", "description");
    await page.fill("input[type=number]", "12.00");
    await page.fill(
      "input[type=url]",
      "https://images.pexels.com/photos/8601664/pexels-photo-8601664.jpeg?_gl=1*194cego*_ga*MTAyNzM1MjE2Mi4xNzMzMTQ2Mjk3*_ga_8JE65Q40S6*czE3NjM5MDQ2ODkkbzQkZzEkdDE3NjM5MDQ3MzckajEyJGwwJGgw"
    );
    await page.click(".submit-button");

    await page.waitForURL("**/restaurateur/plats");
    await page.waitForSelector(".plats-grid .resto-card .resto-info h2 ");

    await page.waitForTimeout(500);

    await expect(
      page.locator(
        ".plats-grid .resto-card .resto-info h2:has-text('nom plat test')"
      )
    ).toBeVisible({ timeout: 10000 });
  });
});
