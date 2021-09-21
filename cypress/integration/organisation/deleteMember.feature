Feature: Adding an organisation Member
  Background:
    Given the user is logged in


  @organisation
  @member
  Scenario: The user should be able to delete the new member
    Given an organization exists
      And a new user exists
      And a new member is added
      And the user is on the organisation detail page
    When the user clicks on the delete member button
    Then the member should be deleted
