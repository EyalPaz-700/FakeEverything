import { Fjax } from "./fjax.js";
import { resetDB } from "./DB.js";

const templates = {
    homeTemplate: document.getElementById('home-temp'),
    loginTemplate: document.getElementById('login-temp'),
    plantTemplate: document.getElementById('plant-temp'),
    profileTemplate: document.getElementById('my-profile-temp')
}

function initApp() {
    document.body.appendChild(templates.loginTemplate.cloneNode(true).content)
    history.pushState({ page: "login" }, "login", "#" + "login")
    defineLoginOnClicks()
    window.onhashchange = () => {
        movePage(history.state.page + "Template")
    }
}

function defineLoginOnClicks() {
    const loginBtn = document.getElementById('login-btn')
    loginBtn.onclick = () => {
        localStorage.setItem("currentUser", JSON.stringify({
            id: 1,
            name: "daksjdlasd",
            plants: [],
        }))
        movePage("homeTemplate")
    }
}

function defineNavOnClicks() {
    const homeNav = document.getElementById('home-nav')
    const profileNav = document.getElementById('profile-nav')
    homeNav.onclick = () => {
        homeNav.classList.add("current-page");
        profileNav.classList.remove("current-page");
        movePage("homeTemplate")
    }
    profileNav.onclick = () => {
        profileNav.classList.add("current-page");
        homeNav.classList.remove("current-page");
        movePage("profileTemplate")
    }

}

function movePage(template) {
    document.body.removeChild(document.body.children[9])
    document.body.appendChild(templates[template].cloneNode(true).content)
    if (template === "loginTemplate") {
        defineLoginOnClicks()
    }
    if (template === "homeTemplate") {
        fetchPlants(1)
        defineNavOnClicks()

    }
    if (template === "profileTemplate") {
        fetchUserPlants();
        defineNavOnClicks()
    }
    const name = template.split('T')[0]
    history.pushState({ page: name }, name, "#" + name)
}

function fetchPlants(pageNum) {
    const plantContainer = document.getElementById('item-container')
    plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content)
    plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content)
    plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content)

}

function fetchUserPlants() {
    const plantContainer = document.getElementById('item-container')
    const reqUserPlants = new Fjax();
    const userId = JSON.parse(localStorage.getItem("currentUser")).id;
    reqUserPlants.open(`/api/users/${userId}`, "POST");
    reqUserPlants.send({ prop: "plants" });
    const userPlants = reqUserPlants._response._content;
    for (let i = 0; i<userPlants.length; i++) {
        const reqPlant = new Fjax;
        reqPlant.open(userPlants[i], "GET");
        reqPlant.send();
        const plant = reqPlant._response._content;
        plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content);``
        plantContainer.children[i].children[0].src = "";
        plantContainer.children[i].children[1].innerText = plant.name;
        plantContainer.children[i].removeChild( plantContainer.children[i].children[2])
    }
}

initApp()
resetDB()


