import { Then, When } from "@cucumber/cucumber";
import { SearchPage } from "../pages/search-page";
import { ICustomWorld, screenShotTake } from "../../../../automation/custom-world";
import { HomePage } from "../pages/home-page";

When(/^I input the Search field with keyword "(.*)"$/, async function (this: ICustomWorld, keyword: string) {
    this.parameters.keywordInputted = keyword;
    await new SearchPage(this.page!).fillKeyword(keyword);
});

When('I click on Search button', async function () {
    await new SearchPage(this.page!).clickSearchButton();
});

When('I clear the input', async function () {
    await new SearchPage(this.page!).clickClearInputButton();
});

Then(/^I should receive "(.*)" results accordingly$/, async function (this: ICustomWorld, numOfResult: string) {
    this.log(`Expected number of results: (${numOfResult})`)
    await new SearchPage(this.page!).verifyNumRes(this, numOfResult);
    await new SearchPage(this.page!).verifySearchTitle(this, this.parameters.keywordInputted);
    await screenShotTake(this);
});

Then(/^I should not be redirected out of the "(.*)" screen$/, async function (this: ICustomWorld, screenName: string) {
    await new HomePage(this.page!).verifyCurrentPage(this, screenName);
    await screenShotTake(this);
});