import type { Response } from "express";
import { pool } from "../../db";
import type { LUser, RUser, TUser } from "../../types";
import bcrypt from 'bcrypt'

export const createUser = async (user:RUser)=>{
    console.log(user)
    const {name, email, password, role} = user
    const hash = await bcrypt.hash(password,10)
    const res = await pool.query(`
        insert into users (name, email, password, role) values ($1,$2,$3,$4)
        returning id, name, email, role, created_at, updated_at`,[name,email,hash,role])
        return res.rows[0] 
    }
    export const validateUser =async (email:string,pass:string)=>{
        
        const res = await pool.query(`
            select * from users where email = $1
            `,[email])
                    if(!res.rows.length){
            return null
        }
        const {password,...user} = res.rows[0] as TUser
        const isValid = await bcrypt.compare(pass,password)
        return isValid? user : null
    
    }

    export const getUserById=async (id:string)=>{
        const res = await pool.query(`
            select * from users where id = $1
            `,[id])
        return res.rows[0] 
    }
    