import { Pool } from "pg"
import config from "../config"
export const pool = new Pool({
    connectionString: config.connectionString
})
export const initDB = async () => {
    await pool.query(`
    create table if not exists users (
    id serial primary key,
    name varchar(100) not null,
    email varchar(222) not null unique,
    password text not null,
    role text not null  default 'contributor' check (role in ('contributor', 'maintainer')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
    )
    `)

    await pool.query(`
        create table if not exists issues(
        id serial primary key,
        title varchar(150) not null,
        description text not null check (char_length(description)>=20),
        type text not null check (type in ('bug', 'feature_request')),
        status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
        reporter_id int not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
        )
        `)
    console.log("Database connected")
}
