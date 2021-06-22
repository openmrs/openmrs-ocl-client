feature: Create Dictionary
  Background:
    Given the user is logged in

  Scenario: A user should be able to create a Dictionary
   Given the user clicks on the Create new dictionary icon
    When the user fills in the required information on the form
    And the user submits the form
    Then the system create a new dictionary