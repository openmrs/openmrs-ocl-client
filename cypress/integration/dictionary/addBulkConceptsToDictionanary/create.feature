Feature: Add bulk concepts to an existing dictionary
  Background:
    Given the user is logged in

  @dictionary
  Scenario: The user should be able to add bulk concepts from their preferred source
    Given the user is on the view dictionary concepts page
     When the user clicks the "Add concept" button
      And the user selects "Import existing concepts"
      And the user selects "Add bulk concepts"
     Then the user should be on the "Add concepts in bulk from CIEL" page
      And the current source should be "CIEL"

  @dictionary
  Scenario: The user should be able to add bulk multiple concepts from their preferred source
    Given the user is on the "Add concepts in bulk from CIEL" page
     When the user enters concept ID "1000"
      And the user enters concept ID "1001"
      And the user enters concept ID "1002"
      And the user clicks the "Add concepts" button
     Then the user is send to "Progress notification" page
      And the concept ID "1000" should be added to the dictionary
      And the concept ID "1001" should be added to the dictionary
      And the concept ID "1002" should be added to the dictionary

  @dictionary
  Scenario: The user should be able to skip the already added concepts from their preferred source
    Given the user is on the "Add concepts in bulk from CIEL" page
     When the user enters concept ID "1000"
      And the user clicks the "Add concepts" button
      And the user is sent to the "Progress notifications" page
     Then the user clicks on "view summary" button
      And concept ID "1000" should be skippped