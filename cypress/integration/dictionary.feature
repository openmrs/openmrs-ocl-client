Feature: Dictionary Manager
  Background:


  Scenario: A user should be able to Create new dictionary
  Given the user is logged in
   Given the user clicks on Dictionaries icon 
   Given the user clicks on create new dictionary icon
   Then the system loads the Create dictionary form
    When the user clicks on Create new dictionary icon
    When the user enters the required information in the given fields
    And a user clicks submits button
    Then the system create new dictionary

  