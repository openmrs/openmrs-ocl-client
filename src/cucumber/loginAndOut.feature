Feature: Login and Logout

  Scenario: Login and Logout
    Given User visits user collection page
    And User should access login
    When User logins in
    And User re-visits user collection page
    And User should access dictionaries
    And User logs out