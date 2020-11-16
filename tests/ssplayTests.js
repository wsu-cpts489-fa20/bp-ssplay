import { Selector, ClientFunction } from 'testcafe'
import {ReactSelector, waitForReact} from 'testcafe-react-selectors'

const login = ReactSelector('loginInterface')

fixture `ssplay test`.page `localhost:8081`.beforeEach(async()=>{await waitForReact()})

test('test login', async t => {
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#feedMode').visible).eql(true)
    .wait(1000)
})

test('test view all courses', async t =>{
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#feedMode').visible).eql(true)
    .wait(1000)

    .click("#courseMode")
    .wait(1000)

    .click('#menuBtnIcon')
    .wait(500)

    .click('#addCourse')
    .expect(Selector('#addCoursePage').visible).eql(true)
    .wait(1000)
})

test('test add course', async t =>{
    await t
    .typeText("#emailInput", "a@a.com")
    .typeText("#passwordInput", "aaAA11!!")
    .click('#login-btn-icon')
    .expect(Selector('#feedMode').visible).eql(true)
    .wait(1000)

    .click("#courseMode")
    .wait(1000)

    .click('#menuBtnIcon')
    .wait(500)

    .click('#addCourse')
    .expect(Selector('#addCoursePage').visible).eql(true)
    .wait(1000)

    .typeText('#id', "k")
    .typeText('#rating', "4")
    .typeText('#review', "kk")
    .typeText('#picture', "kk")
    .typeText('#location', "kk")
    .typeText('#yardage', "kk")
    .typeText('#runningDistance', "kk")
    .typeText('#timePar', "kk")
    .typeText('#bestScore', "kk")
    .typeText('#recordHolder', "kk")
    .click('#submitBtn')
    .wait(500)

    .expect(Selector('#specificCoursePage').visible).eql(true)
    .wait(1000)
})