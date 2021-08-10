Feature: Editing a organisation
  Background:
    Given the user is logged in

  @organisation
  Scenario: The user should be able to make a public organization private
    Given a public organization exists
      And the user is on the edit organization page
    When the user selects "None" Public Access
      And the user submits the form
    Then the organization should not be publicly visible

  @organisation
  Scenario: The user should be able to make a private organization public
    Given a private organization exists
      And the user is on the edit organization page
    When the user selects "View" Public Access
      And the user submits the form
    Then the organization should be publicly visible
 
