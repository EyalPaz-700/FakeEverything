
export function resetDB() {
    if (!localStorage.getItem("users")) {
        const users = {
            count: 0,
            lastId: 0,
            list: [],
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
    }
}

//return data:
export function getItem(table, id) {
    if (!localStorage.getItem(table)) {
        return undefined; //error
    }
    const list = JSON.parse(localStorage.getItem(table)).list;
    for (let item in list) {
        if (item.id === id) {
            return item;
        }
    }
    return false; //no item with id found
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
        if (list[i].id === id) {
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
        if (list[i].id === id) {
            list[i][attribute] = value;
            localStorage.setItem(table, JSON.stringify(data));
            return list[i];
        }
    }
    return false; //no item with id found
}

window.onload = resetDB;