import { Fjax } from "./fjax.js";
import { resetDB } from "./DB.js";

let currentUser = JSON.parse(localStorage.getItem("currentUser")) 
let currentPage;

const templates = {
    homeTemplate: document.getElementById('home-temp'),
    loginTemplate: document.getElementById('login-temp'),
    plantTemplate: document.getElementById('plant-temp'),
    profileTemplate: document.getElementById('my-profile-temp'),
    profilePlantTemplate : document.getElementById('profile-plant-temp')
}


function initApp() {
    if (currentUser){
        document.body.appendChild(templates.homeTemplate.cloneNode(true).content)
        fetchPlants(1)
        defineNavOnClicks()
        defineHomeOnClicks()
        document.getElementById("username").innerText += " " + currentUser.userName;
        currentPage = 1;
        document.getElementById('home-nav').classList.add("current-page");
        document.getElementById('profile-nav').classList.remove("current-page");
        history.pushState({ page: "home" }, "home", "#" + "home")
        document.getElementById("search-btn").addEventListener("click", searchPlants);

    }
    else {
    document.body.appendChild(templates.loginTemplate.cloneNode(true).content)
    history.pushState({ page: "login" }, "login", "#" + "login")
    defineLoginOnClicks()
    window.onhashchange = () => {
        movePage(history.state.page + "Template")
    }
}
    
}

function defineLoginOnClicks() {
    const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const submitButton = document.getElementById('login-btn')

submitButton.onclick = () => {
    const req = new Fjax()
    req.open('/api/users', 'POST')
    if (usernameInput.value.trim().length > 0 && passwordInput.value.trim().length > 0 ) 
    {
        req.send({
            userName : usernameInput.value.trim(),
            password : passwordInput.value.trim()
        })
        if (req._response._content){
            currentPage = 1
            localStorage.setItem("currentUser", JSON.stringify(req._response._content))
            currentUser = req._response._content;
            movePage("homeTemplate")
        }
        else {
            alert("invalid username or password")
        }
    }
    else {
        alert('length can not be zero')
    }
}
}

function defineNavOnClicks() {
    const homeNav = document.getElementById('home-nav')
    const profileNav = document.getElementById('profile-nav')
    const logoutNav = document.getElementById('logout-nav')
    logoutNav.onclick = () => {
        currentUser = undefined
        localStorage.removeItem("currentUser")
        movePage("loginTemplate")
    }
    homeNav.onclick = () => {
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
        document.getElementById("username").innerText += " " + currentUser.userName;
        fetchPlants(1)
        defineNavOnClicks()
        defineHomeOnClicks()
        document.getElementById('home-nav').classList.add("current-page");
        document.getElementById('profile-nav').classList.remove("current-page");
        document.getElementById("search-btn").addEventListener("click", searchPlants);
    }
    if (template === "profileTemplate") {
        fetchUserPlants();
        document.getElementById("username").innerText += " " + currentUser.userName;
        document.getElementById("profile-header").innerText =  `${currentUser.userName}'s Plants`;
        defineNavOnClicks()
        document.getElementById('home-nav').classList.remove("current-page");
        document.getElementById('profile-nav').classList.add("current-page");
    }
    const name = template.split('T')[0]
    history.pushState({ page: name }, name, "#" + name)
}

function fetchPlants(pageNum) {
    const plantContainer = document.getElementById('item-container')
    plantContainer.innerHTML = ''
    const request = new Fjax()
    request.open("/api/plants", "POST")
    request.send({
        pageNum: pageNum
    })
    request._response._content.forEach((flower, index) => {
        plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content)
        plantContainer.children[index].children[0].firstElementChild.src = flower.src;
        plantContainer.children[index].children[1].textContent = flower.name
        plantContainer.children[index].children[2].onclick = () => {
            const rx = new Fjax()
            rx.open("/api/users/" + currentUser.id, "PUT")
            rx.send({
                attribute: "plants",
                plant_id: flower.id
            })
            currentUser.plants = rx._response._content;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
    })


}

function convertListToMap(arr){
    const obj = {}
    for (const link of arr){
        if (obj[link]){
            obj[link] += 1
        }
        else{
        obj[link] = 1 }
    }
    return obj
}

function defineHomeOnClicks() {
    {
        const nextPageBtn = document.getElementById('nextPage')
        const previousPageBtn = document.getElementById('previousPage')
        nextPageBtn.onclick = nextPage
        previousPageBtn.onclick = previousPage
    }
}

function nextPage() {
    debugger
    if (currentPage < 3) {
        currentPage++;
        fetchPlants(currentPage)
    }
}
function previousPage() {
    if ( currentPage >= 2) {
        currentPage--;
        fetchPlants(currentPage)
    }
}

function fetchUserPlants() {
    const plantContainer = document.getElementById('item-container')
    plantContainer.innerHTML = ''
    const reqUserPlants = new Fjax();
    const userId = JSON.parse(localStorage.getItem("currentUser")).id;
    reqUserPlants.open(`/api/users/${userId}`, "POST");
    reqUserPlants.send({ prop: "plants" });
    const userPlants = reqUserPlants._response._content;
    const x = convertListToMap(userPlants)
    let i = 0;
    for (const link in x) {
        const reqPlant = new Fjax;
        reqPlant.open(link, "GET");
        reqPlant.send();
        const plant = reqPlant._response._content;
        plantContainer.appendChild(templates.profilePlantTemplate.cloneNode(true).content);
        const thisPlant =  plantContainer.children[i];
        thisPlant.children[0].firstElementChild.src = plant.src;
        thisPlant.children[1].innerText = plant.name;
        thisPlant.children[2].textContent = x[link]
        thisPlant.children[3].onclick = () => {
            const rx = new Fjax()
            rx.open("/api/users/" + currentUser.id, "DELETE")
            rx.send({
                plant_id: plant.id
            })
            currentUser.plants = rx._response._content;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            fetchUserPlants()
        }
        ++i;
    }
}

function searchPlants() {
    const plantContainer = document.getElementById('item-container')
    const searchInput = document.getElementById("search").value;
    if (!searchInput) {
        return;
    }
    document.getElementById("search").value = "";
    const MatchPlants = new Fjax();
    MatchPlants.open("/api/plants", "POST");
    MatchPlants.send({value: searchInput.toLowerCase(), prop: "name"});
    const resultPlants = MatchPlants._response._content;
    plantContainer.innerHTML = "";
    for (let i = 0; i < resultPlants.length; i++) {
        plantContainer.appendChild(templates.plantTemplate.cloneNode(true).content);
        plantContainer.children[i].children[0].firstElementChild.src = resultPlants[i].src;
        plantContainer.children[i].children[1].innerText = resultPlants[i].name;
        plantContainer.children[i].children[2].onclick = () => {
            const rx = new Fjax()
            rx.open("/api/users/" + currentUser.id, "PUT")
            rx.send({
                attribute: "plants",
                plant_id: resultPlants[i].id
            })
            currentUser.plants = rx._response._content;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
    }
}

initApp()
resetDB()



