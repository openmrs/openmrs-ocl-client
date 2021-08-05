Feature: Copying a dictionary
  Background:
    Given the user is logged in
      And a dictionary exists
      And a version exists
      And a version is released

  @dictionary
  @version
  Scenario: The user should be able to copy dictionary
    Given the user is on the dictionary page
    When the user clicks the more actions button
      And the user selects the "Copy Dictionary" menu list item
      And the user is on copy dictionary form
      And the user enters the new dictionary information
      And the user submits the form
    Then the new dictionary should be created
      And the new source should be created
