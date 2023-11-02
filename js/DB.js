
export function resetDB() {
    if (!localStorage.getItem("users")) {
        const users = {
            count: 2,
            lastId: 2,
            list: [
                {
                    id: 1,
                    userName: "user",
                    password : "testpass",
                    plants: ["/api/plants/1", "/api/plants/3"],
                },
                {
                    id: 2,
                    userName: "moshe",
                    password : "1234",
                    plants: [], 
                }
            ],
        }
        localStorage.setItem("users", JSON.stringify(users));
    }
    if (!localStorage.getItem("plants")) {
        const plants = {
            count: 0,
            lastId: 0,
            list: [],
        }
        localStorage.setItem("plants", JSON.stringify(plants));
        fillPLants();
    }

    function fillPLants() {
        const plantsSrc = [
            "../media/Alstroemeria_aurea.jpg",
            "../media/Clintonia_uniflora.JPG",
            "../media/Cucko.jpg",
            "../media/Dahlia._Erika_Krause.jpg",
            "../media/Desert-rose.jpg",
            "../media/Foxglove.jpeg",
            "../media/Gerbera_farben.JPG",
            "../media/Paeonia_suffruticosa.jpg",
            "../media/Rose_Amber.jpg",
            "../media/Star_Gazer_Lily.JPG",
            "../media/Tiger_Lily.JPG",
            "../media/trumpet_vine.jpg",
            "../media/White_Dutch_irises.jpg",
            "../media/WhiteGazania.JPG"
        ];
        const plantsNames = ["Pink Alestromeria", "Clintonia", "Cucko", "Erika Krause", "Desert Rose", "Fox Glove", "Gerbera", "Paeonia", "Rose Amber", "Star Gazer Lily", "Tiger Lily", "Trumpet Vine", "White Dutch Irise", "White Gazania"];
        const plantColors = ["pink", "white", "purple", "pink", "pink", "purple", "pink", "white", "yellow", "pink", "orange", "orange", "white", "white"];
        for (let i = 0; i < plantsNames.length; i++) {
            addItem("plants", { name: plantsNames[i], src: plantsSrc[i], color: plantColors[i] });
        }
    }
}

//return data:
export function getAll(table) {
    if (!localStorage.getItem(table)) {
        return undefined; //error
    }
    return JSON.parse(localStorage.getItem(table)).list;
}

export function getUser(username,password){
    const users = JSON.parse(localStorage.getItem('users')).list
    for (const user of users){
        if (user.userName === username && user.password === password){
            return user
        }
    }
    return false
}

export function getItem(table, id) {
    if (!localStorage.getItem(table)) {
        return undefined; //error
    }
    const list = JSON.parse(localStorage.getItem(table)).list;
    for (let item of list) {
        if (item.id == id) {
            return item;
        }
    }
    return "item was not found"; //no item with id found
}

export function getAllMatches(table, value, prop = "name") {
    const result = [];
    const dataList = getAll(table);
    if (!dataList) {
        return undefined; //error
    }
    for (let item of dataList) {
        if (item[prop].toLowerCase().includes(value)) {
            result.push(item);
        }
    }
    return result;
}

//add data:
export function addItem(table, item) {
    if (!localStorage.getItem(table)) {
        return undefined; //error
    }
    const data = JSON.parse(localStorage.getItem(table));
    item.id = data.lastId + 1;
    data.lastId++;
    data.count++;
    data.list.push(item);
    localStorage.setItem(table, JSON.stringify(data));
    return item;
}

//remove data:
export function removeItem(table, id) {
    if (!localStorage.getItem(table)) {
        return undefined; //error
    }
    const data = JSON.parse(localStorage.getItem(table));
    const list = data.list;
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            const item = list[i];
            list.splice(i, 1);
            data.count--;
            localStorage.setItem(table, JSON.stringify(data));
            return item;
        }
    }
    return false; //no item with id found
}

//modify data:
export function changeItemAttribute(table, id, attribute, value) {
    if (!localStorage.getItem(table)) {
        return undefined; //error
    }
    const data = JSON.parse(localStorage.getItem(table));
    const list = data.list;
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            list[i][attribute] = value;
            localStorage.setItem(table, JSON.stringify(data));
            return list[i];
        }
    }
    return false; //no item with id found
}

//buy plant
export function addNewPlant(id, plant_id) {
    const data = JSON.parse(localStorage.getItem("users"));
    const users = data.list;
    for (let user of users) {
        if (user.id == id) {
            user.plants.push(`/api/plants/${plant_id}`);
            localStorage.setItem("users", JSON.stringify(data));
            return user.plants;
        }
    }
    return false; //no user with id found
}

//remove plant
export function removePlant(id, plant_id) {
    const data = JSON.parse(localStorage.getItem("users"));
    const users = data.list;
    for (let user of users) {
        if (user.id == id) {
            const plantIndex =  user.plants.indexOf(`/api/plants/${plant_id}`);
            user.plants.splice(plantIndex, 1);
            localStorage.setItem("users", JSON.stringify(data));
            return user.plants;
        }
    }
    return false; //no user with id found
}

//return a property of item
export function getItemProp(table, id, prop) {
    let dataList = getAll(table);
    for (let item of dataList) {
        if (item.id == id) {
            return item[prop];
        }
    }
    return false; //no user with id found
}

//divide to pages: 
export function getPage(pageNum, plantsInPage = 6) {
    const plants = getAll("plants");
    return plants.slice((pageNum - 1) * plantsInPage, pageNum * plantsInPage);
}