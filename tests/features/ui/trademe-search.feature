Feature: Home page search
    As a user
    I want to interact with the Search feature in Trademe home page
    
  Background:
    Given I am on the landing page

    @Search
    Scenario: [TC-S-001] Verify that the result should be shown correctly when inputting correct value
    When I input the Search field with keyword "Watch"
    And I click on Search button
    Then I should receive "3" results accordingly

    @Search
    Scenario: [TC-S-002] Verify that the result should not be shown when inputting invalid value
    When I input the Search field with keyword "!@#$%^&%#$@^#$"
    And I click on Search button
    Then I should receive "0" results accordingly

    @Search
    Scenario: [TC-S-003|TC-S-004] Verify that all characters should be removed when clicking on the 'Clear input' button
    When I input the Search field with keyword "Watch"
    And I clear the input
    And I click on Search button
    Then I should not be redirected out of the "Home" screen