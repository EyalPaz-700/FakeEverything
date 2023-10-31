import { Fjax } from "./fjax.js";
import { resetDB } from "./DB.js";

resetDB()
const a = new Fjax()
a.open("/api/users/1","DELET")
a.send({attribute: "plants", plant_id: 1})
console.log(a);
