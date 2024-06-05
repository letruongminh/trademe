//import repOptions from "./playwright.config";



const config = {
  //paths:["tests/**/*.feature"],
  requireModule: ['ts-node/register','@alex_neo/playwright-azure-reporter'],
  require: ['automation/**/*.{js,ts}', 'tests/**/*.{js,ts}', 'playwright.config.ts'],
  format: [
    'message:reports/cucumber-report.ndjson',
    'json:reports/cucumber-report.json',
    'html:reports/report.html',
    'summary',
    'progress-bar',
    'junit:reports/qaautomation-junit-results.xml',
    //'@alex_neo/playwright-azure-reporter:reports/playwright-azure-reporter.txt'
    //'automation/playwright-azure-report-dcshim.ts'
    //'PlaywrightAzureReportDcshim'
    './automation/playwright-azure-report-dcshim.ts:reports/playwright-azure-report-dcshim.txt'
  ],
  formatOptions: { 
    //snippetInterface: 'async-await',
    playwrightAzureReportDcshimOptions: {
      isEnabled: ((process.env.AZUREADOTESTPLANS_TOKEN??'VALUENOTSET') == 'VALUENOTSET') ? false:true,
      orgUrl: 'https://www.tmsandbox.co.nz/',
      token: process.env.AZUREADOTESTPLANS_TOKEN,
      planId: parseInt((process.env.AZUREPLANID ?? '6902').split(":")[0]), 
      projectName: 'Voyager',
      environment: process.env.SELECTEDENVIRONMENTNAME ?? 'workstation',
      logging: true,
      testRunTitle: 'Framework Test Run',
      publishTestResultsMode: 'testResult',
      uploadAttachments: true,
      attachmentsType: ['screenshot', 'video', 'trace', 'GeneralInfo'],
      testRunConfig: {
        owner: {
          displayName: process.env.AZUREADOTESTPLANS_FULLNAME,
        },
        comment: 'QA Automation Framework Test Run',
        configurationIds: [parseInt(process.env.AZURECONFIGID ?? '79')],  //77 Windows 10, 79 Engineers Workstation, 80 Pipeline-TST
      }
    }
  }
};


export default config;
