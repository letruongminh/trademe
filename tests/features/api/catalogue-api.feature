Feature: Catalogue API
    As a user
    I want to receive correct response upon sending requests to the server in terms of the Catalogue API

    @CatalogueAllCategories
    Scenario: [TC-RAC-001|TC-RAC-008] Verify that all categories should be retrieved using GET method with both correct number and file format
    Given I have a retrieve all categories endpoint
    Then sending request successfully to retrieve a specified category with both correct number and file format

    @CatalogueAllCategories
    Scenario: [TC-RAC-002] Verify that all categories should be retrieved using GET method with both correct number and file format
    Given I have a retrieve all categories endpoint
    Then sending request successfully to retrieve all categories with empty number

    @CatalogueAllCategories
    Scenario: [TC-RAC-003] Verify that a "404" error should be shown when inputting invalid file format
    Given I have a retrieve all categories endpoint
    Then sending request unsuccessfully when retrieving invalid file format

    @CatalogueAllCategories
    Scenario: [TC-RAC-004] Verify that a "404" error should be shown when leaving file format blank
    Given I have a retrieve all categories endpoint
    Then sending request unsuccessfully when leaving file format blank

    @CatalogueAllCategories
    Scenario: [TC-RAC-005] Verify that a "404" error should be shown when inputting invalid number
    Given I have a retrieve all categories endpoint
    Then sending request unsuccessfully when leaving file format blank

    @CatalogueAllCategories
    Scenario: [TC-RAC-006] Verify that nothing should be retrieved using other methods
    Given I have a retrieve all categories endpoint
    Then sending request unsuccessfully when using other methods

    @CatalogueAllCategories
    Scenario: [TC-RAC-007] Verify that nothing should be retrieved using wrong authorization methods
    Given I have a retrieve all categories endpoint
    Then sending request unsuccessfully when using wrong authorization methods

    @CatalogueAllCategories
    Scenario: [TC-RAC-009] Verify that correct categories should be retrieved using all query string parameters
    Given I have a retrieve all categories endpoint
    Then sending request successfully to retrieve a specified category when using all query string parameters