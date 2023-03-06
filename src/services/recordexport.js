import path from "path";
import { chromium } from "playwright";
import { saveVideo } from "playwright-video";

const recordExport = async (viewName, parameters, width, height) => {
  const screenDims = { width, height };
  const browser = await chromium.launch();
  const videoContext = await browser.newContext({
    screen: screenDims,
    viewport: screenDims
  });
  const page = await videoContext.newPage();
  page.setViewportSize(screenDims);
  const videoCapture = await saveVideo(
    page,
    path.join(process.cwd(), "videos/aha.mp4"),
    { fps: 60 }
  );
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173/";
  const encodedParams = Buffer.from(JSON.stringify(parameters)).toString("base64");
  const uri = `${clientOrigin}create/${viewName}?params=${encodedParams}`;
  await page.goto(uri, { timeout: 10000 });
  const titleLocator = page.locator("text=Soapy");
  await titleLocator.click({ timeout: 10000 });
  await videoCapture.stop();
  await videoContext.close();
  await browser.close();
};

export default recordExport;
