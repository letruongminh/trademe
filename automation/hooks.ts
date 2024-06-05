import { ICustomWorld } from './custom-world';
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, ConsoleMessage, ChromiumBrowser, FirefoxBrowser, WebKitBrowser} from '@playwright/test';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
//TODO: bring back file-manager import { ensureDir, removeFiles } from '../support/file-manager'
import { browserConfig, EnvironmentTestData } from '../playwright.config';
import { XrmUiTest } from "d365-ui-test";
import path from 'path';



//TODO: bring back file-manager Ensure reports folder is created
//let reportsDir = 'reports';
//ensureDir(reportsDir);

setDefaultTimeout(process.env.PWDEBUG ? -1 : 3 * 60 * 1000);

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;

let xrmTest: XrmUiTest;
let browserXrm: Browser;
let chromereuse: boolean = false; 

/**
 * Sets browserConfig.browser based on the uri of the pickle (test scenario)
 * //CURRENTLY: no browser required for isp.documentservice, isp.data-change etc so set to NOBROWSER
 * //CURRENTLY: for d365 set to chromereuse
 * @param featureFileUri the pickle.uri to help indicate which feature files are being run
 * @returns void
 */
async function launchBrowser(featureFileUri: string){
  if (typeof browser !== "undefined") {
    return; //already setup
  }
  //let d365FeatureFileMatcher = path.join('tests','features','d365');
  let ispFeatureFileMatcher = path.join('tests','features','isp.');
  // if ((featureFileUri.indexOf(d365FeatureFileMatcher) > -1)) {
  //   browserConfig.browser = 'chromereuse';   //needed for SSO for now
  // } else 
  if (featureFileUri.indexOf(ispFeatureFileMatcher) > -1) {
    browserConfig.browser = 'NOBROWSER';
    return; 
  }
  switch (browserConfig.browser) {
    case 'webkit':
      browser = await webkit.launch(browserConfig.browserOptions);
      break;
    case 'firefox':
      browser = await firefox.launch(browserConfig.browserOptions);
      break;
    case 'chromereuse':
      // Uses this method: https://stackoverflow.com/questions/75982191/connecting-to-an-existing-browser-using-playwright
      // tester starts chrome with debugging port (and signs in manually)
      //  cd "C:\Program Files\Google\Chrome\Application"
      //  .\chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\temp\chromeresusedebug"
      browser = await chromium.connectOverCDP("http://localhost:9222");
      chromereuse = true;
      break;
    default:
      browser = await chromium.launch(browserConfig.browserOptions);
      break;
  }
}

BeforeAll(async function () {
  //TODO: bring back file-manager removeFiles('reports/videos/*.webm');
  //TODO: bring back file-manager removeFiles('reports/images/*.png');
  
});



Before({ tags: '@ignore' }, async function () {
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: ICustomWorld) {
  this.debug = true;
});
Before({ tags: '@d365xrm' }, async function (this: ICustomWorld) {
  this.d365xrm = true;
});

Before(async function (this: ICustomWorld, { pickle,gherkinDocument }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  this.feature = pickle;
  this.parameters.ETD = EnvironmentTestData;
  this.testcasecomments = "";
  if (gherkinDocument.comments){
    for(let comment of gherkinDocument.comments){
      this.testcasecomments += "\nComment: " + comment.text;
    }
  }

  await launchBrowser(pickle.uri); 
  if (browserConfig.browser == 'NOBROWSER') {
    return; 
  }
  if (this.d365xrm){
    xrmTest  = new XrmUiTest();
    //TODO: xrmTest await xrmTest.launch("chromium", {
    //     headless: false,
    //     args: ["--start-fullscreen"]
    // })
    // .then(([b, c , p]) => {
    //     browserXrm = b;
    //     contextXrm = c;
    //     pageXrm = p;
    //     this.context = contextXrm;
    //     this.page = pageXrm;
    // });
    this.context = browser.contexts()[0];
    this.page = this.context?.pages()[0];
    //TODO: add this method to xrmTest if we want to use it xrmTest.setExistingBrowser(browser, this.context, this.page);
    this.xrmTest = xrmTest;
  } else if (chromereuse) {
    this.context = browser.contexts()[0];
    this.page = this.context?.pages()[0];
  } else {
    this.context = await browser.newContext(browserConfig.browserContext);
    await this.context.tracing.start({ screenshots: true, snapshots: true });
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout( browserConfig.actionTimeout );
    this.page.setDefaultNavigationTimeout( browserConfig.navigationTimeout );
    this.page.on('console', async (msg: ConsoleMessage) => {
      if (msg.type() === 'log') {
        this.parameters.browserlog += msg.text() + "\n";
      } else if (msg.type() === ('warn' || 'error')) {
        this.logsafe('Browser Console Warn/Error: ' + msg.text());
      }
    });
  }
  
  
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (this.parameters.browserlog){
    this.attach("Browser Log Output: " + this.parameters.browserlog);
  } 
  if (result) {
    this.attach(`Status: ${result?.status}. Duration:${result.duration?.seconds}s. Started: ${this.startTime?.toLocaleString()} End: ${new Date().toLocaleString()} Comments: ${this.testcasecomments}`);
    if (result.status !== Status.PASSED && typeof this.page != 'undefined') {
      //TODO: add filemanager.ts back in  ensureDir('reports/screenshots');
      const screenshot = await this.page.screenshot({ path: `reports/screenshots/${this.testName}.png`, fullPage: true });
      screenshot && (this.attach(screenshot, 'image/png'));
    }
  }
  if (browserConfig.browser != 'chromereuse') {
    await this.page?.close();
    await this.context?.close();
  }
  await this.apiContext?.dispose();
});

AfterAll(async function () {
  if (browserConfig.browser != 'chromereuse') {
    if (xrmTest){
      await browserXrm.close();
      await xrmTest.close();
    } else if (browserConfig.browser != 'NOBROWSER' &&  typeof browser != 'undefined') {
      await browser.close();
    }
  }
});
