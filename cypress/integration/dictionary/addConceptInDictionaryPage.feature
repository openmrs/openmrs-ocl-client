Feature: Add concepts to an existing dictionary
  Background:
    Given the user is logged in

  @dictionary
  Scenario: The user should be able to add concepts from their preferred source
    Given the user is on the view dictionary concepts page
     When the user clicks the "Add concepts" button
      And the user selects "Import existing concept"
      And the user selects "Pick concepts"
     Then the user should be on the "Import existing concept" page
      And the current source should be "CIEL"

  @dictionary
  Scenario: The user should be able to add a single concept from their preferred source
    Given the user is on the "Import existing concept" page
     When the user clicks on the row for "Serum"
      And the user clicks the "Add selected to dictionary" button
     Then the user should be on the "Import existing concept" page
      And the "Serum" concept should be added to the dictionary

  @dictionary
  Scenario: The user should be able to add multiple concepts from their preferred source
    Given the user is on the "Import existing concept" page
     When the user clicks on the row for "Serum"
      And the user clicks on the row for "Whole blood sample"
      And the user clicks on the row for "Plasma"
      And the user clicks the "Add selected to dictionary" button
     Then the user should be on the "Import existing concept" page
      And the "Serum" concept should be added to the dictionary
      And the "Whole blood sample" concept should be added to the dictionary
      And the "Plasma" concept should be added to the dictionary

  @dictionary
  Scenario: The user should be able to add a single concept from their preferred source while viewing it
    Given the user is on the "Import existing concept" page
     When the user clicks on the link for "Serum"
      And the user is sent to the view concept page
      And the user clicks on the "Add Serum to dictionary" button
     Then the user should be on the view concept page
      And the "Serum" concept should be added to the dictionary

