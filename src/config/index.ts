import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
   quiet:true
})
const config = {
    connectionString: process.env.connectionString,
    port: process.env.port 

}
export default config