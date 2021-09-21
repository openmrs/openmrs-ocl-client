Feature: Adding an organisation Member
  Background:
    Given the user is logged in

  @organisation
  Scenario: The user should be able to click the button to add a new member
    Given an organization exists
      And the user is on the organisation detail page
    When the user clicks on the add new member button
    Then the user should be on the add new member dialog box

  @organisation
  @member
  Scenario: The user should be able to add a new member
    Given an organization exists
      And a new user exists
      And the user is on the add new member dialog box
    When the user enters the member information
      And the user submits the form
    Then the new member should be added
