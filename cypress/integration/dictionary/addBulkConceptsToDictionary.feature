Feature: Add bulk concepts to an existing dictionary
  Background:
    Given the user is logged in

  @dictionary
  Scenario: The user should be able to add bulk concepts from their preferred source
    Given the user is on the view dictionary concepts page
     When the user clicks the "Add concepts" button
      And the user selects "Import existing concept"
      And the user selects "Add bulk concepts"
     Then the user should be on the "Add concepts in bulk from CIEL" page

  @dictionary
  @ciel
  Scenario: The user should be able to add a single bulk concept from CIEL
    Given the user is on the "Add concepts in bulk from CIEL" page
     When the user enters concept Id "1000"
      And the user clicks the "ADD CONCEPTS" button
      Then the user navigates to the "Progess notification" page
      And the concept Id "1000" should be in the dictionary
      
  @dictionary
  @ciel
  Scenario: The user should be able to add multiple bulk concepts from CIEL
    Given the user is on the "Add concepts in bulk from CIEL" page
      When the user enters concept Id "1001"
      And the user enters concept Id "1002"
      And the user clicks the "ADD CONCEPTS" button
      Then the user navigates to the "Progess notification" page
       And the concept Id "1001" should be in the dictionary
       And the concept Id "1002" should be in the dictionary

@dictionary
@ciel
  Scenario: The system should be able to skip an already added bulk concepts from CIEL
    Given CIEL concept "1000" is already in the dictionary
      And the user is on the "Add concepts in bulk from CIEL" page
      And the user enters concept Id "1000"
      And the user clicks the "ADD CONCEPTS" button
     Then the user navigates to the "Progess notification" page
      And concept Id "1000" should be skipped 
                