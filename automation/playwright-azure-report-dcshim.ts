const {  formatterHelpers, Status } = require('@cucumber/cucumber')
import { IFormatterOptions, Formatter } from '@cucumber/cucumber'
import * as pwReporter from '@playwright/test/reporter';
import * as adReporter from '@alex_neo/playwright-azure-reporter';
import * as messages from '@cucumber/messages'
import ITestStepFinished = messages.TestStepFinished;
import ITestCaseStarted = messages.TestCaseStarted;
const _pwLibTest = require('../node_modules/playwright/lib/common/test');
import { aut_apiCommonConfig } from "../playwright.config";
//import { TestPoint } from 'azure-devops-node-api/interfaces/TestInterfaces';

const logLocal = function(msg: string) {
    console.log("PlaywrightAzureReportDcshim: " + msg);
}
class PlaywrightAzureReportDcshim extends Formatter {
    basePWReporterOptions: adReporter.AzureReporterOptions;
    basePWReporter : any;
    PW_CurrentSuite: any;
    PW_CurrentTest: any;
    runStartTime: Date;
    isEnabled: boolean;
    lastTestPlanId: number = -1;
    amBusyWith: string; 

    constructor(options: IFormatterOptions ) {
        super(options)
        this.amBusyWith = ""; 
        this.runStartTime = new Date();
        this.isEnabled = false;
        this.basePWReporterOptions = options.parsedArgvOptions.playwrightAzureReportDcshimOptions;
        try {

            this.isEnabled = options.parsedArgvOptions.playwrightAzureReportDcshimOptions.isEnabled
        } catch {
            return;
        }
        if (!this.isEnabled) {
            return;
        }
        logLocal("Reporter enabled.")

        this.basePWReporter = new adReporter.default(this.basePWReporterOptions);
        options.eventBroadcaster.on('envelope', async (envelope) => {
            if (envelope.testCaseFinished) {
                await this.logTestCaseFinished(envelope.testCaseFinished);
            } else if (envelope.testRunFinished) {
                await this.logTestRunFinished(envelope.testRunFinished)
            } else if (envelope.testRunStarted) {
                await this.logTestRunStarted()
            } else if (envelope.testCaseStarted) {
                await this.logTestCaseStarted(envelope.testCaseStarted)
            }
        });
    }
    // async waitNotBusy(thenWith: string){
    //     while(this.amBusyWith != "" ){
    //         logLocal(`waiting until not busy with ${this.amBusyWith} for ${thenWith}`);
    //         await new Promise((resolve) => setTimeout(resolve, 250));
    //     }
    //     logLocal(`Starting with ${thenWith}`);
    //     this.amBusyWith = thenWith; 
    // }
    // async waitNotBusyClear(){
    //     logLocal(`Finished with ${this.amBusyWith}`);
    //     this.amBusyWith = ""; 
    //     return Promise.resolve();
    // }
    /**
     * Tries to build Playwright test structure
     * urrentTestCase._appendTestResult(); //adds skipped with start time
     * @param testCaseStarted 
     */
    async logTestCaseStarted(testCaseStarted: ITestCaseStarted){
        //await this.waitNotBusy("logTestCaseStarted");
        const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(testCaseStarted.id);
        logLocal(`logTestCaseStarted - checking planId for : ${testCaseAttempt.gherkinDocument.uri}`);
        let planSearchStringsAndIds = process.env.AZUREPLANID ?? '"1111:\\aaa\\|2222:\\bbb\\|3333:\\ccc\\|4444:\\ddd\\"'
        for (const tocheck of planSearchStringsAndIds.split("|")){
                let pieces = tocheck.split(":");
                logLocal(`logTestCaseStarted - looking at  : (${pieces[1]}) or (${pieces[1].replace(/\\/g,"/")})`);
                if ( testCaseAttempt.gherkinDocument.uri?.includes(pieces[1]) || testCaseAttempt.gherkinDocument.uri?.includes(pieces[1].replace(/\\/g,"/"))) {
                    logLocal(`logTestCaseStarted - setting TestPlanId to ${pieces[0]}, looking at: ${testCaseAttempt.gherkinDocument.uri}`); 
                    let newPlanId = parseInt(pieces[0]);
                    this.basePWReporter._planId = newPlanId;

                    // if (this.lastTestPlanId != -1 && this.lastTestPlanId != newPlanId) {
                    //     logLocal(`logTestCaseStarted - PlanID changed so wait to close api connection. ${newPlanId}`);
                    //     await this.basePWReporter._runIdPromise;
                    //     let prevCount = this.basePWReporter._testsAliasToBePublished.length;
                    //     while (this.basePWReporter._testsAliasToBePublished.length > 0) {
                    //         // need wait all results to be published
                    //         logLocal(`logTestCaseStarted - Waiting for all results to be published. ${newPlanId} Remaining ${this.basePWReporter._testsAliasToBePublished.length} results`);
                    //         if (prevCount > this.basePWReporter._testsAliasToBePublished.length) {
                    //             logLocal(`logTestCaseStarted - Waiting for all results to be published. ${newPlanId} Remaining ${this.basePWReporter._testsAliasToBePublished.length} results`);
                    //             prevCount--;
                    //         }
                    //         await new Promise((resolve) => setTimeout(resolve, 250));
                    //     }    
                    //     logLocal(`logTestCaseStarted - Now closing api connection. ${newPlanId}`);
                    //     this.basePWReporter._planId = newPlanId;
                    //     this.basePWReporter._testApi = null; 
                    // } else {
                    //     this.basePWReporter._planId = newPlanId;
                    // }
                }
        }
        this.lastTestPlanId = this.basePWReporter._planId;
        
        if (!this.PW_CurrentSuite){
            const rootSuite = new _pwLibTest.Suite('', 'root');
            const projectSuite = new _pwLibTest.Suite("QAAutomationProject", 'project');
            const gherkenSuite = new _pwLibTest.Suite(testCaseAttempt.gherkinDocument.feature?.name, 'file');
            await projectSuite._addSuite(gherkenSuite);
            await rootSuite._addSuite(projectSuite);
            this.PW_CurrentSuite = gherkenSuite;
        }
        const currentTestCase = new _pwLibTest.TestCase(testCaseAttempt.pickle.name, void 0, '', testCaseAttempt.pickle.uri);
        await currentTestCase._appendTestResult(); 
        currentTestCase.id = testCaseAttempt.testCase.id;
        await this.PW_CurrentSuite?._addTest(currentTestCase);

        this.PW_CurrentTest = currentTestCase;
        //return await this.waitNotBusyClear();
    }
    async logTestRunStarted() {
        logLocal('Playwright Azure Reporter Shim Starting.');
        this.runStartTime = new Date();
        await this.basePWReporter.onBegin();
        logLocal('onBegin Finished.');
    }
    /**
     * 
     * @param testCaseFinished 
     */
    async logTestCaseFinished(testCaseFinished: ITestStepFinished) {
       // await this.waitNotBusy("logTestCaseFinished");
        const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(testCaseFinished.testCaseStartedId)
        let summaryText = "General Info for Test Case Id: " + testCaseFinished.testCaseStartedId;
        summaryText += "\n" + testCaseAttempt.gherkinDocument?.feature?.name + ' / ' + testCaseAttempt.pickle.name + '\n';

       

        const parsed = await formatterHelpers.parseTestCaseAttempt({
            cwd: this.cwd,
            snippetBuilder: this.snippetBuilder,
            supportCodeLibrary: this.supportCodeLibrary,
            testCaseAttempt
        })
        summaryText += "\n\nTest Steps: \n\n";
        parsed.testSteps.forEach((testStep: { keyword: string; text: any; result: { status: string | number; }; }) => {
            summaryText += testStep.keyword + (testStep.text || '') + ' - ' + Status[testStep.result.status] + '\n';
        })
        summaryText += '\n';

        let currentTestCase = this.PW_CurrentTest;

        let res: pwReporter.TestStatus = testCaseAttempt.worstTestStepResult.status == "PASSED"?'passed':'failed';
        summaryText += "Result: " + res + "\n";
        let errorMsg = "";
        if (res === 'failed') {
            errorMsg = testCaseAttempt.worstTestStepResult.message ?? 'unknown error';
            summaryText += "Error Message: " + errorMsg + "\n";
        }

        summaryText += "Environment: " + aut_apiCommonConfig.SELECTEDENVIRONMENTNAME + "\n";
        summaryText += "Is CI: " + (process.env.CI ?? 'no') + "\n";

        let finishTime : Date = new Date();
        let currentResult : pwReporter.TestResult = this.PW_CurrentTest.results[0];
        currentResult.status = res;
        currentResult.duration = finishTime.getTime()-currentResult.startTime.getTime();
        //TODO: locate error object currentResult.error = testCaseAttempt.errorMsg;

        const bodyBuffer = Buffer.from(summaryText, 'utf8')
        let attachments = new Array<{
            name: string,
            contentType: string
            ,path?: string,
            body?: Buffer}>();
        attachments.push({name: "GeneralInfo", contentType: "text/plain", body: bodyBuffer});
        //TODO: get attachments testCaseAttempt.stepAttachments
        currentResult.attachments = attachments;
        //TODO: not pushed by PWReporter so no point!  currentResult.stdout = arStdOut;
        await this.basePWReporter.onTestEnd(currentTestCase, currentResult);
        //return await this.waitNotBusyClear();
    }
    /**
     * //  status: 'passed' | 'failed' | 'timedout' | 'interrupted';
     * @param testRunFinished 
     */
    async logTestRunFinished(testRunFinished: messages.TestRunFinished) {
        //await this.waitNotBusy("logTestRunFinished");
        logLocal('Playwright Azure Reporter Shim Finished: ' + testRunFinished.success ? 'SUCCESS' : 'FAILURE');
        
        let currentResult: pwReporter.FullResult = {
            status: (testRunFinished.success ? 'passed' : 'failed'),
            startTime: this.runStartTime,
            duration: this.runStartTime.getTime() - (new Date()).getTime()
        };
        await this.basePWReporter.onEnd(currentResult);
       // return await this.waitNotBusyClear();
    }
}

module.exports = PlaywrightAzureReportDcshim