import middy from "@middy/core";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop"; 
import puppeteer from "puppeteer-core";
import { dateFormatted, getHour } from "../lib/utils";

import { launch, setupMetamask } from "../lib/index";


/*ENABLE FOR LOCAL TESTING*/
// var browserParams = {
//   headless: false,
//   args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   executablePath:
//     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", //let's use real chrome instead of Chromium
// };

const fetchDataFromDapp = async (): Promise<number> => {
  let browser: any = null;
  try {
    browser = await launch(puppeteer, {
      metamaskVersion: "v10.8.1",
      // metamaskLocation: '/home/browserless'
    });

    const metamask = await setupMetamask(browser);
    const IInstalled = await metamask.switchNetwork("ropsten");
    console.log("IInstalled", IInstalled);
    // await metamask.addToken('0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa');
    // browser = await puppeteer.connect({
    //     browserWSEndpoint: `wss://puppet.blue-swan.io/?token=2cbc5771-38f2-4dcf-8774-50ad51BS-Puppet-Master&stealth`,
    // });

    const page = await browser.newPage();
    // var params = JSON.parse(event.body);
    // console.log("function params", params);

    await page.goto(
      "https://polygon.balancer.fi/#/pool/0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012"
    );
    await page.waitForTimeout(5000);

    const POOL_APR = await page.evaluate(() => {
      let APR = document.querySelector(".divide-y > div > div:nth-child(2)");
      console.log("APR", APR);
      return parseFloat(APR?.innerHTML.replace("%", ""));
    });
    // Now, let's get some simple markdown CSS for print
    // await page.goto(
    //   "https://raw.githubusercontent.com/simonlc/Markdown-CSS/master/markdown.css"
    // );
    // const stylesheet = await page.evaluate(() => document.body.innerText);

    // Finally, let's inject the above in a blank page and print it.
    // await page.goto("about:blank");
    // await page.setContent(apiContent);
    // await page.addStyleTag({ content: stylesheet });

    // Return a PDF buffer to trigger the editor to download.
    // page.pdf();
    return POOL_APR;
  } catch (e) {
    console.log("ERROR IN FETCH DAPP", e);
    browser.close();
  } finally {
    if (browser) {
      browser.close();
    }
  }
};

const writeToSheet = async (POOL_APR: number): Promise<any> => {
  let sheet = new Sheet();
  // let reportFor = ["jose@eprezto.com"]
  // let NameOfSheet = `BALANCER-REPORT`
  // let folder = "1qFX1rf4EIJgHs_60v-M8etMorITSbpzU";
  // let newGoogleSheet = await sheet.createGoogleSheet(reportFor, NameOfSheet);
  // let spreadSheetId = newGoogleSheet.googleSheetId;
  let spreadSheetId = "1cbaZC0pAeW3CJ-AHvKzDaUVo_V2AlYNIFG8ne3oATl0";
  // await sheet.writeToSheet(
  //   ["DATE", "HOUR","PROTOCOL", "POOL_ID", "APR",],
  //   spreadSheetId
  // )
  // await sheet.moveToFolder(spreadSheetId, folder);
  let arrayToWrite = [
    dateFormatted(),
    getHour(),
    "BALANCER",
    "0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012",
    POOL_APR,
  ];
  await sheet.writeToSheet(arrayToWrite, spreadSheetId);

  return "WROTE VALUE IN GOOGLE SHEET";
};

const handler = async (event: any, context: any) => {
    // var params = JSON.parse(event.body);
    // console.log("function params", params);
  try {
    console.log("INITIATING THE PROCESSS");

    /*---RETRIES ENABLED FOR FETCHING DATA TO AVOID NaN situations----*/
    let POOL_APR = await fetchDataFromDapp();
    console.log("POOL_APR", POOL_APR);
    while (isNaN(POOL_APR) || POOL_APR === undefined) {
      POOL_APR = await fetchDataFromDapp();
      console.log("POOL_APR RETRY", POOL_APR);
    }
    /*---------------*/

    /*---WRITE TO GOOGLE SHEET----*/
    let googleSheet = await writeToSheet(POOL_APR);
    console.log("googleSheet", googleSheet);
    /*---------------*/

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: "function running",
        POOL_APR: POOL_APR,
      }),
    };
  } catch (e) {
    let error: any = e;
    console.log("errors on report generation", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: "function running",
        enviarSQSMessage: "ERROR",
      }),
    };
  }
};

export const generate = middy(handler).use(doNotWaitForEmptyEventLoop());
