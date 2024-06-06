# Introduction 
Add a QAAutomation repo for TSB Senior Quality Engineer:

# Getting Started
IDE: VS Code
npm modules installed: 
- playwright
- cucumber NOTE: currently must be 9.6.0 to avoid issue with JS Runner

Extensions:
* Playwright Test for VS Code
* Cucumber
* Cucumber JS Test Runner - to integrate cucumber with VSCode TestExplorer


# Build and Test
Build: 
`npm install`

The first time you'll need to install playwright browsers
`npx playwright install --with-deps chromium` 

Set environment variables/secrets:
(refer Environment Variables section below)

Run Tests:
`npm test`
OR use Test Explorer

Look for report html file in 
_reports\report.html_

In order to run just the playwright-tests folder tests: 
`npx playwright test`

In order to run just *salesforce* tests
`npm test tests/features/salesforce/*.feature`

In order to run just *api e.g. documentservice* tests
`npm test tests/features/**/isp.*.feature`
