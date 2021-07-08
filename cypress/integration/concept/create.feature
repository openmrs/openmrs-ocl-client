Feature: Creating a custom concept
        Background:
            Given the user is logged in
        @dictionary
        Scenario: The user should be able to go to the create custom concept page
            Given a dictionary exists
              And the user is on the dictionary concepts page
             When the user clicks the add concepts button
              And selects Create custom concept menuListItem
             When the user selects Other Kind menuListItem
             Then the user should be on the create concept page

        Scenario: The user should be able to create a custom concept
            Given the user is on the create concept page
             When the user enters the concept information
              And the user submits the form
             Then the new concept should be created
  