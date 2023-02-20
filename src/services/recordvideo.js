import dotenv from "dotenv";
import path from "path";
import { chromium } from "playwright";
import { saveVideo } from "playwright-video";

dotenv.config();
const SCREEN_DIMS = { width: 1920, height: 1080 };

(async () => {
  const browser = await chromium.launch();
  const videoContext = await browser.newContext({
    screen: SCREEN_DIMS,
    viewport: SCREEN_DIMS,
  });
  const page = await videoContext.newPage();
  page.setViewportSize(SCREEN_DIMS);
  const videoCapture = await saveVideo(
    page,
    path.join(process.cwd(), "videos/aha.mp4"),
    { fps: 60 }
  );
  await page.goto("http://localhost:3000/", { timeout: 10000 });
  const attemptLocator = page.locator("text=Neon");
  await attemptLocator.click({ timeout: 5000 });
  await page.waitForURL("http://localhost:3000/neon", { timeout: 10000 });
  const titleLocator = page.locator("text=Soapy");
  await titleLocator.click({ timeout: 10000 });
  await videoCapture.stop();
  await videoContext.close();
  await browser.close();
})();
