Feature: Login Page
  Background:
    Given the user is not logged in

  Scenario: A user should be able to login
    Given the user is on the login page
     When the user enters their credentials
      And the user submits the form
     Then the user should be logged in

  Scenario: A user should be able to login by pressing enter
    Given the user is on the login page
     When the user enters their credentials
      And the user presses enter
     Then the user should be logged in
  
  Scenario: A user should be able to login by clicking the submit button
    Given the user is on the login page
     When the user enters their credentials
      And the user clicks the submit button
     Then the user should be logged in
  
  Scenario: The login form should require a user name to login
    Given the user is on the login page
     When the user enters their password
      And the user submits the form
     Then the user should still be on the login page
      And the username field should be marked as having an error
      And the error message "Username is required" should be visible
  
  Scenario: The login form should require a password to login
    Given the user is on the login page
     When the user enters their username
      And the user submits the form
     Then the user should still be on the login page
      And the password field should be marked as having an error
      And the error message "Password is required" should be visible

  
  Scenario: The login form should display an error when the user's credentials are invalid
    Given the user is on the login page
     When the user enters the wrong credentials
      And the user submits the form
     Then the user should still be on the login page
      And the backend's authentication failed message should be visible

  Scenario: The user should need to login
    Given the user navigates to the public sources page
     Then the user should be redirected to the login page

  Scenario: The user should land on the expected page after logging in
    Given the user navigates to the public sources page
      And the user is redirected to the login page
     When the user enters their credentials
      And the user submits the form
     Then the user should be on the public sources page
