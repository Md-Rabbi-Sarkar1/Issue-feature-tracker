import type { Response } from "express";
import { pool } from "../../db";
import type { RUser, TUser } from "../../types";
import bcrypt from 'bcrypt'
export const createUser = async (user:RUser)=>{
    console.log(user)
    const {name, email, password, role} = user
    const hash = await bcrypt.hash(password,10)
    const res = await pool.query(`
        insert into users (name, email, password, role) values ($1,$2,$3,$4)
        returning name, email, role`,[name,email,hash,role])
        return res.rows[0] 
    }