const { chromium } = require('playwright');

(async () => {

  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled"
    ]
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });

  const page = await context.newPage();

  await page.goto("https://www.linkedin.com/login");

  console.log("Login to LinkedIn, then press ENTER here.");

  await new Promise(resolve => process.stdin.once("data", resolve));

  await context.storageState({ path: "auth.json" });

  console.log("Login session saved.");

  await browser.close();

})();