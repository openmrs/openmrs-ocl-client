Feature: Creating a dictionary
  Background:
    Given the user is logged in
  
  Scenario: The user should be able to click the button to create a new dictionary
    Given the user is on the dictionaries page
     When the user clicks on the create new dictionary button
     Then the user should be on the create new dictionary page
  
  @dictionary
  Scenario: The user should be able to create a new dictionary
    Given the user is on the create new dictionary page
     When the user enters the dictionary information
      And the user submits the form
     Then the new dictionary should be created
      And the new source should be created
  
  @dictionary
  Scenario: The user should be able to create a public dictionary
    Given the user is on the create new dictionary page
     When the user enters the dictionary information
      And the user selects "Public" visibility
      And the user submits the form
     Then the new dictionary should be created
      And the dictionary should be publicly visible
      And the new source should be created
      And the source should be publicly visible
  
  @dictionary
  Scenario: The user should be able to create a private dictionary
    Given the user is on the create new dictionary page
     When the user enters the dictionary information
      And the user selects "Private" visibility
      And the user submits the form
     Then the new dictionary should be created
      And the dictionary should not be publicly visible
      And the new source should be created
      And the source should not be publicly visible
