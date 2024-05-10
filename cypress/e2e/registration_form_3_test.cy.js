beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

import {faker} from '@faker-js/faker'

const validEmail = faker.internet.email()
const Name = faker.person.fullName()
const invalidEmails = [
    'invalidemail@',              // Missing domain part
    'invalidemail@example.',      // Domain ends with dot
    'invalidemail@.com',          // Missing domain name
    'invalidemail.com',           // Missing "@" symbol
    'invalidemail@eee@eee.com',   // Multiple "@" symbols
    '@example.com',               // Missing first part
]


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

it('Check that radio button list is correct', () => {
    cy.get('input[type="radio"]').should('have.length', 4)

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
    DropdownOptions(['','Malaga', 'Madrid', 'Valencia', 'Corralejo'])
})

it('Check that the City dropdown is correct when Country=Estonia', () => {
    cy.get('#country').select(2)
    cy.get('#country option').eq(2).should('have.text', 'Estonia')
    cy.get('#city').find('option[label]').should('have.length', 3)
    DropdownOptions(['','Tallinn', 'Haapsalu', 'Tartu'])
})

it('Check that the City dropdown is correct when Country=Austria', () => {
    cy.get('#country').select(3)
    cy.get('#country option').eq(3).should('have.text', 'Austria')    
    cy.get('#city').find('option[label]').should('have.length', 3)
    DropdownOptions(['','Vienna', 'Salzburg', 'Innsbruck'])
})

it('Verify that city is removed when country is updated', () => {
    //Select "Spain" and assert that it's been selected
    cy.get('#country').select(1)
    cy.get('#country option').eq(1).should('be.selected')
        
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

it('Verify that checkboxes have correct content and links', () => {
    cy.get('input[type="checkbox"]').should('have.length', 2)

    cy.get('input[type="checkbox"]').parent().should('contain','Accept our privacy policy')
    cy.get('input[type="checkbox"]').next().eq(1).should('have.text','Accept our cookie policy')

    //Verify the link is correct
    cy.get('a[href="cookiePolicy.html"]').click()
    cy.url().should('contain', '/cookiePolicy.html')
    cy.go('back')
    cy.url().should('contain', '/registration_form_3.html')
})

it('Check the email format', () => {
    // Test the array of invalid emails
    invalidEmails.forEach(email => {  
        cy.log('Invalid email: '+ email)
        cy.get('[name="email"]').clear().type(email)
        cy.get('#emailAlert').should('be.visible').and('contain', 'Invalid email address.')
    })
    
    //Test a valid email format
    cy.log('Valid email: ' + validEmail)
    cy.get('[name="email"]').clear().type(validEmail)
    cy.get('#emailAlert').should('not.be.visible')
})

})


describe('Section 2: Functional tests for Registration Form 3', () => {

    it('User can submit form with only mandatory fields added', () => {
        MandatoryFields()
        
        // Call the postYourAdd() function
        cy.window().then(window => {
            window.postYourAdd()
        });        
        
        cy.get('#successFrame').should('exist').should('be.visible').and('contain', 'Successful registration')
        cy.get('input[type="submit"]').should('be.enabled').click()
        cy.url().should('contain', '/cypress/fixtures/upload_file.html');
        cy.get('h1').should('contain','Submission received')
    })

    it('User can submit form with all the fields filled', () => {
        MandatoryFields()
        cy.get('#name').type(Name)
        cy.get('[type="radio"]').eq(2).check().should('be.checked')
        cy.get('[type=checkbox').eq(1).check().should('be.checked')
        cy.get('[type="date"]').eq(0).type('2024-05-09').should('have.value','2024-05-09')
        cy.get('#birthday').type('1990-06-06').should('have.value','1990-06-06')

        cy.get('input[type="submit"]').should('be.enabled').click()
        cy.url().should('contain', '/cypress/fixtures/upload_file.html');
        cy.get('h1').should('contain','Submission received')
    })

    it('User can not submit form with a missing email field', () => {
        MandatoryFields()
        cy.get('[name="email"]').clear()
        cy.get('#emailAlert').should('be.visible').and('contain','Email is required')
        cy.get('input[type="submit"]').should('not.be.enabled')

    })

    it('User can submit a file', () => {
        cy.get('#myFile').selectFile('load_this_file_reg_form_3.txt')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.url().should('contain', '/cypress/fixtures/upload_file.html');
        cy.get('h1').should('contain','Submission received')
    })

})    



    //adds random email, random country, random city and clicks "Accept our privacy policy"-button
    function MandatoryFields() { 
        cy.log('Mandatory fields will be filled')
        cy.get('[name="email"]').type(validEmail)
        
        function getRandomInt(min, max){      // Function for random country
            return Math.floor(Math.random() * (max - min + 1)) + min;    
            } 
            cy.get('#country option').then(listing => {        
            const randomNumber = getRandomInt(1, listing.length-1) //generate a random number between 1 and length-1. In this case 1,2,3
            cy.get('#country option').eq(randomNumber).then(($select) => {              //choose an option randomly
              const text = $select.text()                                               //get the option's text
              cy.get('#country').select(text)                                           // select the option on UI
              cy.log('Chosen random country is '+text)
              cy.get('#country option').eq(randomNumber).should('be.selected')
            });    
          })
        
        function getRandomInt(min, max){      // Function for random city
            return Math.floor(Math.random() * (max - min + 1)) + min;    
            } 
            cy.get('#city option').then(listing => {        
            const randomNumber = getRandomInt(1, listing.length-1)
            cy.get('#city option').eq(randomNumber).then(($select) => {              
              const text = $select.text()      
              cy.get('#city').select(text)       
              cy.log('Chosen random city is '+text)
              cy.get('#city option').eq(randomNumber).should('be.selected')

            });    
          })

        cy.get('[type="checkbox"]').eq(0).check().blur
        }

    //Function for verifying City dropdown content
    function DropdownOptions(cityOptions) {
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.text)
            expect(actual).to.deep.eq(cityOptions)
        })
    } 