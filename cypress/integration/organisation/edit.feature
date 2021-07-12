Feature: Editing a organisation
  Background:
    Given the user is logged in

  @organisation
  Scenario: The user should be able to make an organisation public access View 
    Given a public organisation exists
      And the user is on the edit organisation page
    When the user selects "View" public access
      And the user submits the form
    Then the organisation should public access in "View" state
  
  @organisation
  Scenario: The user should be able to make an organisation public access none
    Given a public organisation exists
      And the user is on the edit organisation page
    When the user selects "None" view
      And the user submits the form
    Then the organisation should be "None" public access
    
      
