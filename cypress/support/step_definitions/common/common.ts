/// <reference types="cypress" />
/// <reference types="../../" />
import { Given } from "cypress-cucumber-preprocessor/steps";

Given("the user is logged in", () => cy.visit("/").login());
