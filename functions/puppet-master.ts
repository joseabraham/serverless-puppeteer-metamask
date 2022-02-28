import middy from "@middy/core";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop"; 
import puppeteer from "puppeteer-core";
import { launch, setupMetamask } from "../lib/index";


const connectWallet = async (page: puppeteer.Page, metamask) => {  
  
  const button = await page.$('#connect-wallet');  
  await button.click();
  console.log("1. Clicked Connect Button")
  
  const overlay_button = await page.$('.overflow-y-auto > div');    
  await overlay_button.click();
  console.log("2. Clicked Overlay Button")
  await page.waitForTimeout(1000);
  
  await metamask.approve();
  await page.bringToFront();
  return;
}

const fillUptheSwapFields = async(page: puppeteer.Page) =>{
    console.log("FILLING AMOUNT FIELD")
    await page.$eval(
      "input[title='Token Amount']",
      //@ts-ignore
      (el, value) => (el.value = value),
      9999
    );

}

const connectToSushiSwap = async (): Promise<boolean> => {
  let browser: any = null;
  try {
    browser = await launch(puppeteer, {
      metamaskVersion: "v10.1.1",      
    });
    
    const metamask = await setupMetamask(browser);
    const page = await browser.newPage();
    await page.goto(
      "https://app.sushi.com/en/swap"
    );

    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    await page.waitForTimeout(1000);
    await connectWallet(page, metamask);
    await fillUptheSwapFields(page);

    await page.waitForTimeout(60000);
    browser.close();
    
    return true;
  } catch (e) {
    console.log("ERROR IN DAPP", e);
    browser.close();
    return false
  } 
};


const handler = async (_event: any, _context: any) => {
  try {
    console.log("INITIATING THE PROCESSS");

    /*---RETRIES ENABLED FOR FETCHING ----*/
    let EXECUTED_SUCCESSFULLY = await connectToSushiSwap();
    
    while (!EXECUTED_SUCCESSFULLY) {
      EXECUTED_SUCCESSFULLY = await connectToSushiSwap();
      console.log("EXECUTED_SUCCESSFULLY", EXECUTED_SUCCESSFULLY);
    }
    /*---------------*/

  
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: "function running",
        EXECUTED_SUCCESSFULLY: EXECUTED_SUCCESSFULLY,
      }),
    };
  } catch (e) {
    let error: any = e;
    console.log("ERROR IN LAMBDA", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: "function running",
        EXECUTED_SUCCESSFULLY: "ERROR",
      }),
    };
  }
};

export const generate = middy(handler).use(doNotWaitForEmptyEventLoop());
