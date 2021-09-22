Feature: Organisation details Page
        Background:
            Given the user is logged in

        @organisation
        Scenario: The user should see all details of the organisation
            Given an organization exists
              And the user is on the organisation details page
             Then the organisation name should be displayed
              And the organisation sources should be displayed
              And the organisation members should be displayed
              And the organisation dictionaries should be displayed
  
        @organisation
        Scenario: The user should see organisation sources
            Given an organization exists
              And a source exists in the organisation
             When the user is on the organisation details page
             Then the user should see the organisation source
             When the user clicks on the source
             Then the user should be on the org source page

        @organisation
        Scenario: The user should see organisation dictionary
            Given an organization exists
              And a dictionary exists in the organisation
             When the user is on the organisation details page
             Then the user should see the organisation dictionary
             When the user clicks on the dictionary
             Then the user should be on the org dictionary page
