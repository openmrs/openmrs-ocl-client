Feature: Creating an organisation
  Background:
    Given the user is logged in
  
  Scenario: The user should be able to click the button to create a new organisation
    Given the user is on the organisation page
     When the user clicks on the create new organisation button
     Then the user should be on the create new organisation page
  
  @organisation
  Scenario: The user should be able to create a new organisation
    Given the user is on the create new organisation page
     When the user enters the organisation information
      And the user submits the form
     Then the new organisation should be created

  @organisation
  Scenario: The user should be able to create a public organisation
    Given the user is on the create new organisation page
     When the user enters the organisation information
      And the user selects "View" Public Access
      And the user submits the form
     Then the new organisation should be created
      And the organisation should be publicly visible
      And the source found is displayed 
      And the dictionary found is displayed

