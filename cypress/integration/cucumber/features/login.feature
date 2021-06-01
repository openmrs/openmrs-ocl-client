Feature: Login

        Scenario: User Login
            Given User tries to visit collections page
              And User is redirected to login page
             When User logs in
              And User re-visits collections page
             Then User should access collections