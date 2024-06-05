import { Locator, Page } from "@playwright/test";
import { aut_salesforceConfig } from "../../../../playwright.config";
// import { ICustomWorld } from '../../../../automation/custom-world';

export class LoginPage {
  protected page: Page;
  protected userName: Locator; 
  protected password: Locator;
  protected loginButton: Locator;
  protected autconfig;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.locator('id=username');
    this.password = page.locator('id=password'); 
    this.loginButton = page.locator('id=Login');
    this.autconfig = aut_salesforceConfig;
  }

  public async open(): Promise<void> {
    await this.page.goto(this.autconfig.BASE_URL);
  }

  // public async login(w: ICustomWorld): Promise<void> {    
  //   if (await this.page.locator("lst-breadcrumbs div.slds-breadcrumb__item").isVisible({timeout: 3000})) {
  //     console.info('LoginPage.login - already logged in.');
  //     return;
  //   }
    
  //   // w.log("Login: " + this.autconfig.username + ":" +(this.autconfig.password.length>0?"PasswordHasLength":"EmptyPassword"));
  //   // await this.userName.fill(this.autconfig.username);
  //   // await this.password.fill(this.autconfig.password);
  //   // await this.loginButton.click();
  // }
 
}
