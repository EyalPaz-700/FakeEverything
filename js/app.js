import { Fjax } from "./fjax.js";
import { resetDB } from "./DB.js";

resetDB()
const a = new Fjax()
a.open("/api/plants","POST")
a.send({prop: "name", value: "d"})
console.log(a)
