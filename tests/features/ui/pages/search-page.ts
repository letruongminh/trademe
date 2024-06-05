import { Locator, Page, expect } from "@playwright/test";
import { HomePage } from "./home-page";
import { aut_salesforceConfig } from "../../../../playwright.config";
import { ICustomWorld } from "../../../../automation/custom-world";
export class SearchPage extends HomePage {
    protected page: Page;
    protected autconfig;

    // Search textbox
    protected searchTextbox: Locator;
    protected searchButton: Locator;
    protected clearInputButton: Locator;
    protected resultCount: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.autconfig = aut_salesforceConfig;

        // Search textbox
        this.searchTextbox = page.locator('label').nth(1);
        this.searchButton = page.getByLabel('Search all of Trade Me', { exact: true });
        this.clearInputButton = page.getByRole('button', { name: 'Clear input' });
        this.resultCount = page.locator('h3[class="tm-search-header-result-count__heading ng-star-inserted"]');
    }

    public async fillKeyword(keyword: string) {
        await this.searchTextbox.click();
        await this.searchTextbox.fill(keyword);
    }

    public async clickSearchButton() {
        const startTime = Date.now();
        await this.searchButton.click();
        return startTime; 
    }

    public async verifySearchTitle(thisWorld: ICustomWorld, keyword: string) {
        thisWorld.log(`Verified screen title to be: ('${keyword}' for sale | Trade Me)`);
        const currentScreenTitle = await this.page.title();
        expect(currentScreenTitle).toBe(`'${keyword}' for sale | Trade Me`);
    }

    public async clickClearInputButton() {
        await this.clearInputButton.click();
    }

    public async verifyNumRes(thisWorld: ICustomWorld, numOfResult: string) {
        const promise: Promise<string | null> = this.resultCount.textContent();
        const actualNumOfRes: string | null = await promise;
        let endTime = Date.now();
        if (actualNumOfRes !== null) {
            const match = actualNumOfRes.match(/\b\d+\b/);
            if (match !== null) {
                const extractedText: string = match[0];
                thisWorld.log(`Verified the actual number of results: (${extractedText})`);
                expect(extractedText).toBe(numOfResult);
            } else {
                throw new Error("Could not extract number from the text content.");
            }
        } else {
            throw new Error("Text content is null.");
        }
        thisWorld.log(`Time to process: (${endTime - thisWorld.parameters.startTime})`);
        expect(endTime - thisWorld.parameters.startTime).toBeLessThanOrEqual(3000);
    }
}