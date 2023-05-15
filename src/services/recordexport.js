import { nanoid } from "nanoid";
import path from "path";
import { chromium } from "playwright";
import { saveVideo } from "playwright-video";
import getExportParams from "./getexportparams.js";

const recordExport = async (exportId) => {
  const parameters = getExportParams(exportId);
  const encodedParams = Buffer.from(JSON.stringify(parameters)).toString("base64");
  // TODO get dims from export parameters
  const screenDims = { width: 1280, height: 720 };

  const browser = await chromium.launch();
  const videoContext = await browser.newContext({
    screen: screenDims,
    viewport: screenDims
  });
  const page = await videoContext.newPage();
  page.setViewportSize(screenDims);
  const videoCapture = await saveVideo(
    page,
    path.join(process.cwd(), `videos/${nanoid()}.mp4`),
    { fps: 60 }
  );
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173/";
  const uri = `${clientOrigin}create/${viewName}?params=${encodedParams}`;
  await page.goto(uri, { timeout: 10000 });
  const titleLocator = page.locator("text=Soapy");
  await titleLocator.click({ timeout: 10000 });
  await videoCapture.stop();
  await videoContext.close();
  await browser.close();

  
};

export default recordExport;
