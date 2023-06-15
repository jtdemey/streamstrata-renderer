import { nanoid } from "nanoid";
import path from "path";
import { chromium } from "playwright";
import { saveVideo } from "playwright-video";
import { log, logError } from "../server/logger.js";
import setExportError from "./setexporterror.js";

const createVideoCapture = async (browser, exportId, fileName, page, videoContext) => {
  try {
    const videoCapture = await saveVideo(
      page,
      path.join(process.cwd(), fileName),
      { fps: 60 }
    );
    log("Video capture created", exportId);
    return videoCapture;
  } catch(e) {
    logError(e, exportId);
    await videoContext.close();
    await browser.close();
  }
};

const getBrowserContext = async (browser, exportId, screenDims) => {
  try {
    const videoContext = await browser.newContext({
      screen: screenDims,
      viewport: screenDims,
      recordVideo: {
        dir: "/videos"
      }
    });
    return videoContext;
  } catch(e) {
    logError(e, exportId);
    await browser.close();
  }
};

const getNewPage = async (browser, exportId, videoContext) => {
  try {
    const page = await videoContext.newPage();
    log("Created new page", exportId);
    return page;
  } catch(e) {
    logError(e, exportId);
    await videoContext.close();
    await browser.close();
  }
};

const launchChromium = async (exportId) => {
  try {
    const browser = await chromium.launch();
    log("Browser launched", exportId);
    return browser;
  } catch(e) {
    logError(e, exportId);
  }
};

const recordExport = async (exportId, parameters) => {
  log("Starting recording process", exportId);
  const viewName = parameters.view;
  if (!viewName) {
    logError("No view specified in parameters", exportId);
    setExportError(exportId);
    return;
  }

  const screenDims = { width: parameters.width || 1280, height: parameters.height || 720 };
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173/";
  const uri = `${clientOrigin}create/${viewName}?r=1&export-id=${exportId}`;
  const fileName = `videos/raw/${nanoid()}.mp4`;

  const browser = await launchChromium(exportId);
  const videoContext = await getBrowserContext(browser, exportId, screenDims);
  const page = await getNewPage(browser, exportId, videoContext);
  page.setViewportSize(screenDims);

  await page.goto(uri, { timeout: 10000 });
  log("Navigated to application", exportId);
  const videoCapture = await createVideoCapture(browser, exportId, fileName, page, videoContext);
  try {
    await page.locator("#test").click({ timeout: 10000 });
  } catch(e) {
    logError(e, exportId);
  }
  // await page.click({ timeout: 10000 });
  await videoCapture.stop();
  log("Video capture stopped", exportId);
  await videoContext.close();
  await browser.close();
  log("Ending recording process", exportId);
  return fileName;
};

export default recordExport;
