import { Fjax } from "./fjax.js";
import { resetDB } from "./DB.js";

resetDB()
const a = new Fjax()
a.open("/api/users/1","GET")
a.send()
console.log(a)
