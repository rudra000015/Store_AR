import app from "./src/app.js"
import DbConnect from "./src/config/db.js"

await DbConnect()

app.listen(3000,()=>{
    console.log("listening on port 3000")
})
