import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import axios from "axios";
import { generateRandomToken } from "./common-steps";

let endpoint: string;
let response: Response;

Given('I have a retrieve all categories endpoint', async function () {
    endpoint = 'https://api.trademe.co.nz/v1/Categories';
});

Then(/^sending request successfully to retrieve a specified category with both correct number and file format$/, async function () {
    const startTime = Date.now();
    response = await axios.get(endpoint + '/0001-.xml');
    const endTime = Date.now();

    expect(response.status).toBe(200);
    expect(endTime - startTime).toBeLessThanOrEqual(3000);
});

Then(/^sending request successfully to retrieve all categories with empty number$/, async function () {
    const startTime = Date.now();
    response = await axios.get(endpoint + '.xml');
    const endTime = Date.now();

    expect(response.status).toBe(200);
    expect(endTime - startTime).toBeLessThanOrEqual(3000);
});

Then(/^sending request unsuccessfully when retrieving invalid file format$/, async function () {
    const startTime = Date.now();
    let endTime = 10000000;
    let errorOccurred = false;
    try {
        response = await axios.get(endpoint + '.docx');
        endTime = Date.now();
    }
    catch (error: any) {
        if (error.response && error.response.status === 404)
            errorOccurred = true;
    }
    expect(errorOccurred).toBe(true);
    expect(endTime - startTime).toBeLessThanOrEqual(3000);
});

Then(/^sending request unsuccessfully when leaving file format blank$/, async function () {
    const startTime = Date.now();
    let endTime = 10000000;
    let errorOccurred = false;
    try {
        response = await axios.get(endpoint + '/0001-');
        endTime = Date.now();
    }
    catch (error: any) {
        if (error.response && error.response.status === 404)
            errorOccurred = true;
    }
    expect(errorOccurred).toBe(true);
    expect(endTime - startTime).toBeLessThanOrEqual(3000);
});

Then(/^sending request unsuccessfully when inputting invalid number$/, async function () {
    const startTime = Date.now();
    let endTime = 10000000;
    let errorOccurred = false;
    try {
        response = await axios.get(endpoint + '/dsfdsfsf.xml');
        endTime = Date.now();
    }
    catch (error: any) {
        if (error.response && error.response.status === 404)
            errorOccurred = true;
    }
    expect(errorOccurred).toBe(true);
    expect(endTime - startTime).toBeLessThanOrEqual(3000);
});

Then(/^sending request unsuccessfully when using other methods$/, async function () {
    const startTime = Date.now();
    let endTime = 10000000;
    let errorOccurred = false;
    try {
        response = await axios.delete(endpoint + '/0001-.xml');
        endTime = Date.now();
    }
    catch (error: any) {
        if (error.response && error.response.status === 405)
            errorOccurred = true;
    }
    expect(errorOccurred).toBe(true);
    expect(endTime - startTime).toBeLessThanOrEqual(3000);
});

Then(/^sending request unsuccessfully when using wrong authorization methods$/, async function () {
    const token = generateRandomToken(32);
    const startTime = Date.now();
    let endTime = 10000000;
    let errorOccurred = false;
    try {
        response = await axios.get(endpoint + '/0001-.xml', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        endTime = Date.now();
    } catch (error: any) {
        if (error.response && error.response.status === 401)
            errorOccurred = true;
    }
    expect(errorOccurred).toBe(true);
    expect(endTime - startTime).toBeLessThanOrEqual(3000);
});

Then(/^sending request successfully to retrieve a specified category when using all query string parameters$/, async function () {
    // Query parameters
    const params = {
        depth: 'full',
        region: 'global',
        with_counts: true
    };
    const startTime = Date.now();
    response = await axios.get(endpoint + '/0001-.xml', {
        params: params
    });
    const endTime = Date.now();

    expect(response.status).toBe(200);
    expect(endTime - startTime).toBeLessThanOrEqual(3000);
});