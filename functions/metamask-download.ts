import middy from "@middy/core";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop"; 
import { download } from "../lib/index";

const downloadMetamaskLocally = async (): Promise<string> => {
  
  try {
    let metamaskPath = await download({
      metamaskVersion: "v10.8.1",
      metamaskLocation: './home/browserless'
    });
  
    return metamaskPath;
  } catch (e) {
    console.log("ERROR DOWNLOADING METAMASK", e);
    
  } 
};


const handler = async (_event: any, _context: any) => {
  try {    
    /*---METAMASK DOWNLOAD LOCALLY----*/
    let DOWNLOAD_METAMASK:string = await downloadMetamaskLocally();    
    /*---------------*/
  
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: "function running",   
        metamask_path: DOWNLOAD_METAMASK     
      }),
    };
  } catch (e) {
    let error: any = e;
    console.log("errors on DOWNLOADING METAMASK", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: "function error",
        metamask_path: "ERROR",
      }),
    };
  }
};

export const generate = middy(handler).use(doNotWaitForEmptyEventLoop());
