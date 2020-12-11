import { Selector, ClientFunction } from 'testcafe'
 import {ReactSelector, waitForReact} from 'testcafe-react-selectors'

const login = ReactSelector('loginInterface')

fixture `ssplay test`.page `localhost:8080`.beforeEach(async()=>{await waitForReact()})

test('test local login', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)
    .wait(1000)
})

test('test view add courses', async t =>{
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)
    .wait(100)

    .click("#courseMode")
    .wait(100)

    .click('#menuBtnIcon')
    .wait(100)

    .click('#addCourse')
    .expect(Selector('#addCoursePage').visible).eql(true)
    .wait(1000)
})

test('test add course', async t =>{
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)
    .wait(100)

    .click('#menuBtnIcon')
    .wait(100)

    .click('#addCourse')
    .expect(Selector('#addCoursePage').visible).eql(true)
    .wait(100)

    .typeText('#id', "Windross Farm Golf Course (Auckland, NZ)")
    .typeText('#courseName', "Windross Farm Golf Course")
    .typeText('#rateStandard', "150")
    .typeText('#rateSenior', "100")
    .typeText('#rating', "4")
    .typeText('#review', "kk")
    .typeText('#picture', "https://www.australiangolfdigest.com.au/wp-content/uploads/2017/09/Landscapes_FI.jpg")
    .typeText('#location', "kk")
    .typeText('#yardage', "kk")
    .typeText('#runningDistance', "kk")
    .typeText('#timePar', "kk")
    .typeText('#bestScore', "kk")
    .typeText('#recordHolder', "kk")
    .click('#submitBtn')
    .wait(100)

    .expect(Selector('#allCoursesPage').visible).eql(true)
    .wait(1000)
})

test('test show more modal', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)

    .click('#moreBtn')
    .expect(Selector('#moreModal').visible).eql(true)
    .wait(1000)
})

test('test show rates modal', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)

    .click('#ratesBtn')
    .expect(Selector('#ratesModal').visible).eql(true)
    .wait(1000)
})

test('test show booking page', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)

    .click('#bookingBtn')
    .expect(Selector('#bookingPage').visible).eql(true)
    .wait(1000)
})

test('test show advanced search', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)

    .click('#menuBtnIcon')
    .wait(100)

    .click('#specificCourse')
    .expect(Selector('#specificCoursePage').visible).eql(true)
    .wait(100)

    .click('#advancedSearchBtn')
    .expect(Selector('#advancedSearchPage').visible).eql(true)

    .click('#searchOptions')
    .click('#RATING')
    .typeText('#rating', "1")
    .click('#submitBtn')

    .expect(Selector('#specificCoursePage').visible).eql(true)
    .wait(1000)
})

test('test show all appointments', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)

    .click('#menuBtnIcon')
    .wait(100)

    .click('#allAppointments')
    .expect(Selector('#allAppointmentsPage').visible).eql(true)
    .wait(100)
})

test('test show my appointments', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)

    .click('#menuBtnIcon')
    .wait(100)

    .click('#myAppointments')
    .expect(Selector('#myAppointmentsPage').visible).eql(true)
    .wait(100)
})



test('Add card', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)


    .click('#menuBtnIcon')

    .click('#addCardbtn')
    .wait(100)

    .typeText("#name", "Puthypor Sengkeo")
    .typeText("#number", "123456789")
    .typeText("#expDate", "10/20")
    .click('#EditBtn')
    .wait(100)
})

test('Delete card', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)


    .click('#menuBtnIcon')

    .click('#addCardbtn')
    .wait(100)
    .click('#remove')
    .click('#Agree')
    .wait(100)
})

test('Leave Review', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#allCoursesPage').visible).eql(true)


    .click('#moreBtn')

    .click('#LeaveBtn')
    .click('#selectBtn')
    .click('#one')
    .typeText("#feedback", "Picturesque course. A real speedgolf challenge.")
    .click('#submitReview')

    .wait(100)
})