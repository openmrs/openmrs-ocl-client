Feature: Creating a dictionary version, releasing it and copy subscription URL
  Background:
    Given the user is logged in

  @dictionary
  Scenario: The user should be able to click the button to create a new version
    Given a dictionary exists
      And the user is on the dictionary page
    When the user clicks the create new version button
    Then the user should be on the create new version dialog box

  @dictionary
  @version
  Scenario: The user should be able to create a new version
    Given a dictionary exists
      And the user clicks on the create new version dialog box
    When the user enters the version information
      And the user submits the form
    Then the new version should be created

  @dictionary
  @version
  Scenario: The user should be able to release a version
    Given a dictionary exists
      And a version exists
      And the user is on the dictionary page
    When the user clicks release status switch
      And the release dialog opens
      And the user clicks yes button
    Then the version should be released

  @dictionary
  @version
  @released
  Scenario: The user should be able to copy subscription URL
    Given a dictionary exists
      And a version exists
      And a version is released
      And the user is on the dictionary page
    When the user clicks the more actions button
      And the user selects the "Copy Subscription URL" menu list item
    Then the subscription url should be copied