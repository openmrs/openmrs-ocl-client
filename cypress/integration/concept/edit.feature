Feature: Edit and retire a custom concept
        Background:
            Given the user is logged in

        @dictionary
        @concept
        @organisation
        Scenario: The user should be able edit a custom concept
            Given a dictionary exists
              And a concept exists
              And the user is on the edit concept page
             When the user edits the concept name
            #   And the user submits the form
            #  Then the concept should be updated

        # @dictionary
        # @concept
        # @organisation
        # Scenario: The user should be able to retire a custom concept
        #     Given a dictionary exists
        #       And a concept exists
        #       And the user is on the edit concept page
        #      When the user clicks the Menu button
        #       And the user selects the "Retire concept" menu list item
        #      Then the concept should be retired