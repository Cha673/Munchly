import { expect, test } from "@nuxt/test-utils/playwright";

test.describe("Parcours complet utilisateur - Commande", () => {
  test("un utilisateur peut se connecter, ajouter un plat au panier, valider sa commande", async ({
    page,
  }) => {
    // 1. Connexion de l'utilisateur
    await page.goto("/login");
    await page.fill("input[type=email]", "test_user@example.com");
    await page.fill("input[type=password]", "user123");
    await page.click("button");

    await page.waitForURL("**/restaurants");
    console.log("Current URL:", page.url());

    await page.click(".resto-grid a:nth-of-type(1)");
    console.log("Current URL:", page.url());

    await page.waitForURL("**/restaurants/1");
    await page.waitForSelector(".restaurant-info");
    await page.click(".plats-grid a:nth-of-type(1)");
    console.log("Current URL:", page.url());

    await page.waitForSelector(".plat-content");
    await page.click(".btn-cart");
    await page.click(".btn-view-cart");

    await page.waitForURL("**/user/panier");
    await page.waitForSelector(".panier-items");

    // Valider la commande
    await page.click(".btn-valider");
    await page.waitForTimeout(500);

    await page.click(".btn-historique");
    await page.waitForURL("**/user/commandes");
    //s'il n'y a pas de commande la classe n'existe pas
    await page.waitForSelector(".commandes-list");
  });
});
