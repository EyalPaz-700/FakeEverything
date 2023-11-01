import { Fjax } from "./fjax.js";
import { resetDB } from "./DB.js";

const templates = {
    homeTemplate : document.getElementById('home-temp'),
    loginTemplate : document.getElementById('login-temp'),
    plantTemplate : document.getElementById('plant-temp'),
    profileTemplate : document.getElementById('my-profile-temp')
}

function initApp(){
    document.body.appendChild(templates.loginTemplate.cloneNode(true).content)
    history.pushState({page: "login"},"login", "#" + "login")
    defineLoginOnClicks()
    window.onhashchange = () => {
        movePage(history.state.page + "Template")}

}

function defineLoginOnClicks(){
    const loginBtn = document.getElementById('login-btn')
    loginBtn.onclick = () => {
        movePage("homeTemplate")
    }
}

function defineNavOnClicks(){
    const homeNav = document.getElementById('home-nav')
    const profileNav = document.getElementById('profile-nav')
    homeNav.onclick = () => {
        
        movePage("homeTemplate")
    }
    profileNav.onclick = () => {
        movePage("profileTemplate")
    }

}

function movePage(template){
    document.body.removeChild(document.body.children[9])
    document.body.appendChild(templates[template].cloneNode(true).content)
    if (template === "loginTemplate"){
        defineLoginOnClicks()
    }
    if (template === "homeTemplate"){
        fetchPlants(1)
        defineNavOnClicks()

    }
    if (template === "profileTemplate"){
        defineNavOnClicks()
    }
    const name = template.split('T')[0]
    history.pushState({page: name},name, "#" + name)
}

function fetchPlants(pageNum){
    const plantContainer = document.getElementById('item-container')
    plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content)
    plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content)
    plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content)

}

initApp()
resetDB()
const a = new Fjax()
a.open("/api/plants","POST")
a.send({prop: "name", value: "d"})
console.log(a)


