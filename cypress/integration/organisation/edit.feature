Feature: Editing a organisation
  Background:
    Given the user is logged in

  @organisation
  Scenario: The user should be able to make a public organisation 
    Given a public organisation exists
      And the user is on the edit organisation page
     When the user selects "View" Public Access
      And the user submits the form
     Then the organisation should Public Access in "View" state
      And the source found should be publicly visible
  
  @organisation
  Scenario: The user should be able to make a public Access none
    Given a public organisation exists
      And the user is on the edit organisation page
     When the user selects "None" Public Access
      And the user submits the form
     Then the organisation should be "none"publicly Access
      Then the organisation should Public Access in "View" state
      And the source found should be publicly visible
