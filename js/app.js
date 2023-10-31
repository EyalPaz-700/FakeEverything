import { Fjax } from "./fjax.js";
import { resetDB } from "./DB.js";

resetDB()
const a = new Fjax()
debugger
a.open("/api/users/1","GET")
a.send()
