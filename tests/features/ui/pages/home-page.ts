import { Page, expect } from "@playwright/test";
import { aut_salesforceConfig } from "../../../../playwright.config";
import { ICustomWorld } from '../../../../automation/custom-world';


export class HomePage {
  protected page: Page;
  protected autconfig;

  public readonly HOMEPAGE_TITLE: string = "Buy & Sell on NZ's #1 Auction & Classifieds Site | Trade Me";

  constructor(page: Page) {
    this.page = page;
    this.autconfig = aut_salesforceConfig;
  }


  public async verifyCurrentPage(thisWorld: ICustomWorld, screenName: string) {
    if (screenName == 'Home') {
      thisWorld.log(`Verified the title of the current screen: (${this.page.title()})`);
      const title = await this.page.title();
      expect(title).toBe(this.HOMEPAGE_TITLE);
    }
  }
}
