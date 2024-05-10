beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

import {faker} from '@faker-js/faker'


const userName = faker.internet.userName()
const email = faker.internet.email()
const firstName = faker.person.firstName()
const lastName = faker.person.lastName()
const phoneNumber = faker.string.numeric(8)
const password = faker.internet.password()


function MandatoryFields() {
    cy.log('Mandatory fields will be filled')

    cy.get('input[data-testid="user"]').type(userName)
    cy.get('#email').type(email)
    cy.get('[data-cy="name"]').type(firstName)
    cy.get('#lastName').type(lastName)
    cy.get('[data-testid="phoneNumberTestId"]').type(phoneNumber)
    cy.get('h2').contains('Password').click()
}


describe('Section 1: Functional tests', () => {

    it('User can use only passwords that match', ()=>{
        cy.get('#username').type('Test1')
        cy.get('[id="email"]').type(email)
        cy.get('input[name="name"]').type(firstName)
        cy.get('#lastName').type(lastName)
        cy.get('[data-testid="phoneNumberTestId"]').type(phoneNumber)
        cy.get('#password').type(password)
        cy.get('#confirm').type('Password12')

        //in order to activate error message, user has to click somewhere outside the input field
        cy.get('h2').contains('Password').click()

        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#password_error_message').should('be.visible').should('contain','Passwords do not match!')

        // Change the test, so the passwords would match
        cy.get('#confirm').scrollIntoView()
        cy.get('#confirm').clear().type(password).blur()
        cy.get('#password_error_message').should('not.be.visible')
        cy.get('.submit_button').should('be.enabled').click()
        cy.get('#success_message').should('be.visible')
    })
    

    it('User can submit form with all fields added', ()=>{
        MandatoryFields()
        cy.get('#password').type(password).should('have.prop','nodeName','INPUT').and('have.attr', 'type', 'password')
        cy.get('#confirm').type(password).should('have.prop','nodeName','INPUT').and('have.attr', 'type', 'password')
        cy.get('[type="radio"]').check("JavaScript").should('be.checked')
        cy.get('[type="checkbox"]').check(["Car","Boat"], {force: true}).should('be.checked')
        cy.get('#cars').select('Saab')
        cy.get('#cars option').eq(1).should('have.value','saab').and('be.selected')
        cy.get('#animal').select(3)
        cy.get('#animal option').eq(3).should('have.value','hippo').and('be.selected')

        //enable submit button + assert that it is enabled
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled').click()
        cy.get('#success_message').should('be.visible')
    })


    it('User can submit form with valid data and only mandatory fields added', ()=>{
        MandatoryFields()
        cy.get('.submit_button').should('be.enabled').click()
        cy.get('#success_message').should('be.visible')
    })


    it('User can not submit form with a missing email field', ()=> {
        MandatoryFields()
        cy.get('[id="email"]').clear()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')
       
        //Assert that email has tooltip with error message
        cy.get('input[name="email"]').should('have.attr', 'title').should('contain', 'Input field')
        //Assert that email has box-shadow indicating it's a mandatory field
        cy.get('input[name="email"]').should('have.css', 'box-shadow').should('contain', 'rgb(255, 0, 0)')
    })    


    it('User can not submit form with a missing phone number field', ()=> {
        MandatoryFields()
        cy.get('[data-testid="phoneNumberTestId"]').clear()
       
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')

        //Assert thet phone number field has tooltip
        cy.get('[data-testid="phoneNumberTestId"]').should('have.attr', 'title').should('contain', 'Add phone number')
        //Assert that phone number field has box-shadow indicating it's a mandatory field
        cy.get('[data-testid="phoneNumberTestId"]').should('have.css', 'box-shadow').should('contain', 'rgb(255, 0, 0)')
    })   


    it('User can not submit form with a missing username field', ()=> {
        MandatoryFields()
        cy.get('input[data-testid="user"]').clear()

        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')

        //Assert that field has tooltip with error message
        cy.get('input[data-testid="user"]').should('have.attr', 'title').should('contain', 'Input field')
        //Assert that field has box-shadow indicating it's a mandatory field
        cy.get('input[data-testid="user"]').should('have.css', 'box-shadow').should('contain', 'rgb(255, 0, 0)')
        //Assert that error message appears
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')
    })   


    it('User can not submit form with a missing fist name field', ()=> {
        MandatoryFields()
        cy.get('[data-cy="name"]').clear()

        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')

        //Assert that field has tooltip with error message
        cy.get('[data-cy="name"]').should('have.attr', 'title').should('contain', 'Input field')
        //Assert that field has box-shadow indicating it's a mandatory field
        cy.get('[data-cy="name"]').should('have.css', 'box-shadow').should('contain', 'rgb(255, 0, 0)')
        //Assert that error message appears
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')
    })   


    it('User can not submit form with a missing last name field', ()=> {
        MandatoryFields()
        cy.get('#lastName').clear()

        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')

        //Assert thet  field has tooltip with error message
        cy.get('#lastName').should('have.attr', 'title').should('contain', 'Input field')
        //Assert that phone number field has box-shadow indicating it's a mandatory field
        cy.get('#lastName').should('have.css', 'box-shadow').should('contain', 'rgb(255, 0, 0)')
        //Assert that error message appears
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')
    })   
})



describe('Section 2: Visual tests', () => {

    it('Check that Cerebrum Hub logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        cy.get('img').invoke('height').should('be.lessThan', 178).and('be.greaterThan', 100)
        cy.get('img').invoke('width').should('be.lessThan', 180).and('be.greaterThan', 100)   
    })


    it('Check that Cypress logo is correct and has correct size', () => {
        cy.get('img').eq(1).should('have.attr', 'src','cypress_logo.png')
        cy.get('img[data-cy="cypress_logo"]').invoke('height').should('be.lessThan', 178).and('be.greaterThan', 85)   
        cy.get('img[data-cy="cypress_logo"]').invoke('width').should('be.lessThan', 120).and('be.greaterThan', 100)   
    });


    it('Check navigation (Registration form 1 link)', () => {
        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        
        // Get navigation element, find its first child, check the link content and click it
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        
        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_1.html')
        
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
        cy.url().should('contain', '/registration_form_2.html')
    })


    it('Check navigation (Registration form 3 link)', () => {
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .click()
        cy.url().should('contain', '/registration_form_3.html')
        cy.go('back')
        cy.log('Back again in registration form 2')
        cy.url().should('contain', '/registration_form_2.html')

    })


    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP')

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


    it('Check that "Your Favorite transport" checklist is correct', () => {
        // Array of found elements with given selector has 3 elements in total
        cy.get('input[type="checkbox"]').should('have.length', 3)

        // Verify labels of the checklist elements
        cy.get('input[type="checkbox"]').next().eq(0).should('have.text','I have a bike')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text','I have a car')
        cy.get('input[type="checkbox"]').next().eq(2).should('have.text','I have a boat')

        //Verify default state of checklist elements
        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(2).should('not.be.checked')

        // It is possible to select one or all of the elements, selecting elements will not remove previously selections
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(2).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('be.checked')

        //It is possible to uncheck all elements
        cy.get('input[type="checkbox"]').eq(0).uncheck().should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).uncheck().should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(2).uncheck().should('not.be.checked')
    })    


    it('Check that the Car dropdown is correct', () => {
        // Here is just an example how to explicitely create screenshot from the code
        // Select second element and create screenshot for this area or full page
        cy.get('#cars').select(1).screenshot('Cars drop-down')
        cy.screenshot('Full page screenshot')

        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)
        
        // Check  that first element in the dropdown has text Volvo
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        
        // Check the content of the Cars dropdown
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })


    it('Check that the Favorite animal dropdown is correct', () => {
        cy.get('#animal').children().should('have.length', 6)

        //Check the content of the Animals dropdown
        cy.get('#animal').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['dog', 'cat', 'snake', 'hippo', 'cow', 'mouse'])
        })
    })
})

