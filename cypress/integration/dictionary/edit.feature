Feature: Editing a dictionary
  Background:
    Given the user is logged in

  @dictionary
  Scenario: The user should be able to make a public dictionary private
    Given a public dictionary exists
      And the user is on the edit dictionary page
     When the user selects "Private" visibility
      And the user submits the form
     Then the dictionary should not be publicly visible
      And the source should not be publicly visible
  
  @dictionary
  Scenario: The user should be able to make a private dictionary public
    Given a private dictionary exists
      And the user is on the edit dictionary page
     When the user selects "Public" visibility
      And the user submits the form
     Then the dictionary should be publicly visible
      And the source should be publicly visible
