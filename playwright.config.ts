import { defineConfig, devices, LaunchOptions, BrowserContextOptions } from '@playwright/test';
import { convertToBoolean } from './automation/helpers/stringhelpers';
//import { AzureReporterOptions } from '@alex_neo/playwright-azure-reporter/dist/playwright-azure-reporter';

// export const repOptions = {

//   orgUrl: 'https://www.tmsandbox.co.nz/',
//   token: process.env.AZUREADOTESTPLANS_TOKEN,
//   planId: parseInt(process.env.AZUREPLANID ?? '6902'), 
//   //  6902 is Integration stream plan:  TODO how select others? https://www.tmsandbox.co.nz/
//   projectName: 'Voyager',
//   environment: process.env.SELECTEDENVIRONMENTNAME ?? 'test',
//   logging: true,
//   testRunTitle: 'Playwright Test Run',
//   publishTestResultsMode: 'testRun',
//   uploadAttachments: true,
//   attachmentsType: ['screenshot', 'video', 'trace'],
//   testRunConfig: {
//     owner: {
//       displayName: 'QA Automation',
//     },
//     comment: 'Playwright Test Run',
//     configurationIds: [77],
//   },
// } as AzureReporterOptions;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  //testDir: './playwright-tests',
  testDir: './tests',
  //testDir: './features',
  /* Run tests in files in parallel DISABLED 
  fullyParallel: true,
  */
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only - disabled 
  retries: process.env.CI ? 2 : 0,
  */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /*reporter: 'html',*/
  reporter: [
    ['html']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  
});
export const aut_exampleConfig = {
  BASE_URL: 'https://www.playwright.dev/',
  username: process.env.EGUSERNAME ?? "",
  password: process.env.EGPASSWORD ?? "",
  mfaSecret: process.env.EGMFASECRET ?? undefined,
  userinitials: process.env.EGUSERINITIALS ?? ""
}
export const aut_salesforceConfig = {
  BASE_URL: process.env.SALESFORCEBASEURL ??'https://www.tmsandbox.co.nz/',
  API_HEADERS: {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-encoding': 'gzip, deflate, br',
    'referer': 'https://www.tmsandbox.co.nz/',
    'x-api-client-id': 'salesforceautomation',
    'x-requested-with': 'XMLHttpRequest'
  }
};

export const aut_apiDocumentserviceConfig = {
  BASE_API_URL: process.env.APIDSBASEURL ?? 'https://www.tmsandbox.co.nz/', //'https://app-ais-document-service-api-dev-ae.azurewebsites.net/',
  TOKEN: process.env.APIDSTOKEN ?? ''
}

export const aut_apiCommonConfig = {
  APICLIENTID: process.env.azureAdClientId ?? "ecf3c51e-8977-493c-a994-1798aa2c39f0",
  TOKENGETURLBASE: process.env.azureAdInstance ?? 'https://login.microsoftonline.com/',
  TOKENGETURLTENANTID: process.env.azureAdTenantId ?? 'c099fbd5-a5ab-448e-b816-16a377ab3167',
  TOKENGETURLSUFFIX: '/oauth2/token',
  TOKENGETURLSUFFIXFORSCOPE: '/oauth2/v2.0/token',
  APITOKENSECRET: process.env.APITOKENSECRET ?? '',
  TOKEN: process.env.APIDSTOKEN ?? '',
  testDataDir: "testdata",
  testDataDownloadsTempDir: "tempdownloads",
  APISUBSCRIPTIONKEYFORENV: process.env.APISUBSCRIPTIONKEYFORENV ?? '',
  TOPICENVIRONMENTNAME: process.env.SELECTEDENVIRONMENTNAME ?? '',
  SELECTEDENVIRONMENTNAME: process.env.SELECTEDENVIRONMENTNAME ?? '',
  SELECTEDENVIRONMENTALTNAME: process.env.SELECTEDENVIRONMENTALTNAME ?? ''
}

export const browserOptions: LaunchOptions = {
  slowMo: 0,
  //args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--start-maximized'],
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', process.env.PWWINDOWSIZE??'--window-size=1920,1080'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
  headless: convertToBoolean(process.env.RUNHEADLESS) !== undefined ? convertToBoolean(process.env.RUNHEADLESS) : !!process.env.CI,
};

export const browserContext: BrowserContextOptions = { 
  acceptDownloads: true,
  //viewport: browserOptions.headless ? {width: 1920, height: 1080} : null,
  viewport: null,
  permissions: [
    'geolocation'
  ]
};



export const browserConfig = {
  //FOR REUSE use 'chromereuse'
  // tester starts chrome with debugging port (and signs in manually)
  //  cd "C:\Program Files\Google\Chrome\Application"
  //  .\chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\temp\chromeresusedebug"
  //browser: 'chromereuse', 
  browser: process.env.BROWSER ?? 'chromium',
  browserOptions, 
  browserContext,
  //TODO: Put back timeouts to 2 and 3 mins respectively, for now reduce timeouts while developing pipeline
  actionTimeout: 2 * 10 * 1000,
  navigationTimeout: 3 * 10 * 1000,
  IMG_THRESHOLD: { threshold: 0.4 }
};

/**
 * Environment test data 
 * readable as __PARAMVAL__ETD.XXX where is is the items in this object, e.g. __PARAMVAL__ETD.AT_KEEP_TestCompany_1a.Name__
 * this means it is saved into thisWorld.parameters.ETD
 */
export const EnvironmentTestData = {
  AT_KEEP_TestCompany_1a: {
    Name: "AT_KEEP_TestCompany_1a",
    SFId: "001Og000005T7mPIAS",
    D365PartyNumber: "000004303",
    D365ContactPersonId1: "123458"
  }
}


