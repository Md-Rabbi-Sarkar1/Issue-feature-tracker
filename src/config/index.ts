import dotenv from 'dotenv'

dotenv.config({
    quiet: true
})
const config = {
    connectionString: process.env.connectionString,
    port: process.env.port,
    accessSecret: process.env.accessSecret as string
}
export default config