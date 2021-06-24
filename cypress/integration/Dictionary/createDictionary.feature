Feature: Dictionary Management

  Scenario: A user to create a new dictionary
    Given the user is logged in
    And is on the user collections page
    Then the user clicks on Create Dictionary Icon
     Then the user should be able to create new dictionary

  Scenario: A user should be able to create new dictionary by pressing on Create new dictionary icon
    Given the user is on the Dictionaries page
     When the user clicks on Create new dictionary icon
     Then the create Dictionary form is filled
     Then the user should be able to create new dictionary
  
  Scenario: A user should be able to create a new dictionary by filling the required information
    Given the user is on the Create Dictionary page
     When the user enters the required information in the form
      And the user clicks the submit button
     Then the user should be able to create a new dictionary
  
  Scenario: The Create Dictionary form should require a Dictionary Name to Create new dictionary
    Given the user is on the Create Dictionary page
     When the user enters their Dictionary Name
      And the user submits the form
     Then the user should still be on the Create Dictionary page
      And the Short code, Preferred Source, Owner, Visibility and Preferred Language fields should be marked as having an error
      And the error message "Short code is required" should be visible
      And the error message "Select a preferred source" should be visible
      And the error message "Select this dictionary's owner" should be visible
      And the error message "Select who will have access to this dictionary" should be visible
      And the error message "Select a preferred language" should be visible
  
  Scenario: The Create Dictionary form should require a Short Code to Create new dictionary
    Given the user is on the Create Dictionary page
     And the user has entered their Dictionary Name
     When the user enters their Short Code
      And the user submits the form
     Then the user should still be on the Create Dictionary page
      And the Preferred Source, Owner, Visibility and Preferred Language fields should be marked as having an error
      And the error message "Select a preferred source" should be visible
      And the error message "Select this dictionary's owner" should be visible
      And the error message "Select who will have access to this dictionary" should be visible
      And the error message "Select a preferred language" should be visible

    Scenario: The Create Dictionary form should require a Preferred Source to Create new dictionary
    Given the user is on the Create Dictionary page
     And the user has entered their Dictionary Name
     And the user has entered their Short Code
     When the user enters their Preferred Source
      And the user submits the form
     Then the user should still be on the Create Dictionary page
      And the Owner, Visibility and Preferred Language fields should be marked as having an error
      And the error message "Select this dictionary's owner" should be visible
      And the error message "Select who will have access to this dictionary" should be visible
      And the error message "Select a preferred language" should be visible 

   Scenario: The Create Dictionary form should require Owner to Create new dictionary
    Given the user is on the Create Dictionary page
     And the user has entered their Dictionary Name
     And the user has entered their Short Code
     And the user has entered their Preferred Source
     When the user enters the Dictionary Owner
      And the user submits the form
     Then the user should still be on the Create Dictionary page
     And the Visibility and Preferred Language fields should be marked as having an error
      And the error message "Select who will have access to this dictionary" should be visible
      And the error message "Select a preferred language" should be visible    

    Scenario: The Create Dictionary form should require Visibility to Create new dictionary
    Given the user is on the Create Dictionary page
     And the user has entered their Dictionary Name
     And the user has entered their Short Code
     And the user has entered their Preferred Source
     And the user has entered the dictionary Owner
     When the user enters the Dictionary Visibility
      And the user submits the form
     Then the user should still be on the Create Dictionary page
     And the Preferred Language fields should be marked as having an error
      And the error message "Select a preferred language" should be visible

   Scenario: The Create Dictionary form should require Preferred Language to Create new dictionary
    Given the user is on the Create Dictionary page
     And the user has entered their Dictionary Name
     And the user has entered their Short Code
     And the user has entered their Preferred Source
     And the user has entered the dictionary Owner
     And the user has entered their Visibility
     When the user enters the Dictionary Preferred Language
      And the user submits the form
     Then the user should be able to Create new dictionary 
       
  Scenario: The Create Dictionary form should display an error when the user uses an existing Dictionary Name
    Given the user is on the Create Dictionary page
     When the user enters all the required information with an existing Dictionary Name
      And the user submits the form
     Then the user should still be on the Create Dictionary page
      And the backend's authentication failed message should be visible

  Scenario: The Create Dictionary form should display an error when the user uses an existing Short Code
    Given the user is on the Create Dictionary page
     When the user enters all the required information with an existing Short Code
      And the user submits the form
     Then the user should still be on the Create Dictionary page
      And the backend's authentication failed message should be visible    

  Scenario: The user should Create new dictionary
    Given the user navigates to the public Dictionaries page
     Then the user should be redirected to the collections page


