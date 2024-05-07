beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

import {faker} from '@faker-js/faker'

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */

describe('Section 1: Visual tests for Registration Form 3', () => {

//Check radio buttons and their content
it('Check that radio button list is correct', () => {
    // Array of found elements with given selector has 4 elements in total
    cy.get('input[type="radio"]').should('have.length', 4)

    // Verify labels of the radio buttons
    cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
    cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
    cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
    cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')

    //Verify default state of radio buttons
    cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    cy.get('input[type="radio"]').eq(1).should('not.be.checked')
    cy.get('input[type="radio"]').eq(2).should('not.be.checked')
    cy.get('input[type="radio"]').eq(3).should('not.be.checked')

    // Selecting one will remove selection from the other radio button
    cy.get('input[type="radio"]').eq(0).check().should('be.checked')
    cy.get('input[type="radio"]').eq(1).check().should('be.checked')
    cy.get('input[type="radio"]').eq(0).should('not.be.checked')
})

/* dropdown and dependencies between 2 dropdowns:
* list of cities changes depending on the choice of country*/

it('Check that the Country dropdown is correct', () => {
    cy.get('#country').find('option[label]').should('have.length', 3)
    
    // Verify the content of the Country dropdown
    cy.get('#country').find('option').then(options => {
        const actual = [...options].map(option => option.label)
        expect(actual).to.deep.eq(['','Spain', 'Estonia', 'Austria'])
    })
})

it('Check that the City dropdown is correct when Country=Spain', () => {
    cy.get('#country').select(1)
    cy.get('#country option').eq(1).should('have.text', 'Spain')
    
    // Verify the length and content of the City dropdown
    cy.get('#city').find('option[label]').should('have.length', 4)
    cy.get('#city').find('option').then(options => {
        const actual = [...options].map(option => option.label)
        expect(actual).to.deep.eq(['','Malaga', 'Madrid', 'Valencia', 'Corralejo'])
    })
})

it('Check that the City dropdown is correct when Country=Estonia', () => {
    cy.get('#country').select(2)
    cy.get('#country option').eq(2).should('have.text', 'Estonia')
    
    // Verify the length content of the City dropdown
    cy.get('#city').find('option[label]').should('have.length', 3)
    cy.get('#city').find('option').then(options => {
        const actual = [...options].map(option => option.label)
        expect(actual).to.deep.eq(['','Tallinn', 'Haapsalu', 'Tartu'])
    })
})

it('Check that the City dropdown is correct when Country=Austria', () => {
    //Verify that there are 3 elements with label attribute
    cy.get('#country').select(3)
    cy.get('#country option').eq(3).should('have.text', 'Austria')
        
    // Verify the length and content of the City dropdown
    cy.get('#city').find('option[label]').should('have.length', 3)
    cy.get('#city').find('option').then(options => {
        const actual = [...options].map(option => option.label)
        expect(actual).to.deep.eq(['','Vienna', 'Salzburg', 'Innsbruck'])
    })
})

// if city is already chosen and country is updated, then city choice should be removed
it('Verify that city is removed when country is updated', () => {
    //Select "Spain" and assert that it's been selected
    cy.get('#country').select(1)
    cy.get('#country').find('option[label="Spain"]').should('be.selected')
        
    //Choose a city
    cy.get('#city').select(2)
    cy.get('#city').find('option[value="string:Madrid"]').should('be.selected')

    //Choose another country and verify it has been selected
    cy.get('#country').select("Estonia")
    cy.get('#country').find('option[label="Estonia"]').should('be.selected')

    //Assert that Madrid is not visible anymore and that no Estonian cities have been selected
    cy.get('#city').find('option[value="string:Madrid"]').should('not.exist')
    cy.get('#city').children().should('not.be.selected')
})

it.only('Verify that checkboxes have correct content and links', () => {
    //Verify that there are two elements in the checkbox list
    cy.get('input[type="checkbox"]').should('have.length', 2)

    //Verify the checkbox labels
    cy.get('input[type="checkbox"]').parent().should('contain','Accept our privacy policy')
    cy.get('input[type="checkbox"]').next().eq(1).should('have.text','Accept our cookie policy')

    //Verify the link of the label is correct
    cy.get('a[href="cookiePolicy.html"]').click()
    cy.url().should('contain', '/cookiePolicy.html')
    cy.go('back')
    cy.url().should('contain', '/registration_form_3.html')
})

it.only('Check the email format', () => {
    const invalidEmails = [

    ]


})

})



/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */