import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { APIRequestContext, BrowserContext, Page, PlaywrightTestOptions } from '@playwright/test';
import * as messages from '@cucumber/messages';
import { XrmUiTest } from "d365-ui-test";
import * as stringHelpers from './helpers/stringhelpers';

export interface ICustomWorld extends World{
  debug: boolean;
  d365xrm: boolean;
  xrmTest?: XrmUiTest;
  feature?: messages.Pickle;
  context?: BrowserContext;
  apiContext?: APIRequestContext;
  page?: Page;  
  testName?: string;
  startTime?: Date;
  playwrightOptions?: PlaywrightTestOptions;
  logsafe: (msg: string)=>void;
  testcasecomments: String; 
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
  debug = false;
  d365xrm = false;
  testcasecomments = "";
  logsafe = (msg: string) => {
    this.log(stringHelpers.escapeHTML(msg));
  }
}

export const screenShotTake = async (thisWorld: ICustomWorld) => {
  
  if (typeof thisWorld.page != 'undefined') {
    const screenshot = await thisWorld.page?.screenshot({ path: `reports/screenshots/${thisWorld.testName}.png`, fullPage: true });
    screenshot && (thisWorld.attach(screenshot, 'image/png'));
  } else {
    thisWorld.log("screenShotTake - no page so can not take screenshot.");
  }
}
setWorldConstructor(CustomWorld);
