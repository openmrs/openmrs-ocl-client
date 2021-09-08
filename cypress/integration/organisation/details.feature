Feature: Organisation details Page
        Background:
            Given the user is logged in

        @organisation
        Scenario: The user should see all details of the organisation
            Given an organization exists
              And the user is on the organisation details page
             Then the user should see details of the organisation
        
        @organisation
        Scenario: The user should see organisation sources
            Given an organization exists
              And a source organisation exists
             When the user is on the organisation details page
             Then the user should see the organisation source
             When the user clicks on the source
             Then the user should be on the org source page
 