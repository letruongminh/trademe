import { Given } from "@cucumber/cucumber";
import { ICustomWorld } from '../../../../automation/custom-world';
import { LoginPage } from "../pages/login-page";

Given('I am on the landing page', async function (this: ICustomWorld) {
    await new LoginPage(this.page!).open();
});