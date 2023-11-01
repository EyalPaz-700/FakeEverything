import { Fjax } from "./fjax.js";
import { resetDB } from "./DB.js";

resetDB()
const a = new Fjax()
a.open("/api/users/1","POST")
a.send({prop: "name"})
console.log(a)
