Feature: Pick Concept from Sources and Dictionaries and add to an existing dictionary
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
  @ciel
  Scenario: The user should be able to add a single concept from their preferred source
    Given the user is on the "Import existing concept" page
     When the user clicks on the row for "No"
      And the user clicks on the "Add selected to dictionary" button
     Then the user should be on the "Import existing concept" page
      And the "No" concept should be added to the dictionary

  @dictionary
  @ciel
  Scenario: The user should be able to add multiple concepts from their preferred source
    Given the user is on the "Import existing concept" page
     When the user clicks on the row for "No"
      And the user clicks on the row for "Myoma"
      And the user clicks on the row for "Myxoma"
      And the user clicks on the "Add selected to dictionary" button
     Then the user should be on the "Import existing concept" page
      And the "No" concept should be added to the dictionary
      And the "Myoma" concept should be added to the dictionary
      And the "Myxoma" concept should be added to the dictionary

  @dictionary
  @ciel
  Scenario: The user should be able to add a single concept from their preferred source while viewing it
    Given the user is on the "Import existing concept" page
     When the user clicks on the link for "No"
      And the user is sent to the view concept page
      And the user clicks on the "Add No to dictionary" button
     Then the "No" concept should be added to the dictionary

  @dictionary
  @ctd
  Scenario: The user should be able to add concepts from their preferred dictionary
    Given the user is on the "Import existing concept" page
     When the user clicks on the "switch-source" button 
      And the user clicks on the "showing all sources" switch
      And the user selects the preferred existing dictionary
    Then the concepts in the selected dictionary should be displayed  

  @dictionary
  @ctd
  Scenario: The user should be able to add a single concept from their preferred dictionary
    Given the user is on the selected dictionary Concepts page
     When the user clicks on the row for "Test"
      And the user clicks on the "Add selected to dictionary" button
     Then the user should be on the selected dictionary Concepts page
      And the "Test" concept should be added to the dictionary 
      And the current source should be "CTD" 

@dictionary
  @ciel
  Scenario: The user should be able to add multiple concepts from their preferred dictionary
    Given the user is on the "Import existing concept" page
     When the user clicks on the row for "Test"
      And the user clicks on the row for "Epilepsy"
      And the user clicks on the row for "Yes"
      And the user clicks on the "Add selected to dictionary" button
     Then the user should be on the "Import existing concept" page
      And the "Test" concept should be added to the dictionary
      And the "Epilepsy" concept should be added to the dictionary
      And the "Yes" concept should be added to the dictionary
