import type { Request, Response } from "express";
import type { TIssue, UIssue } from "../../types";
import { pool } from "../../db";
import { platform } from "node:os";

export const createIssueIntoDB = async (issue:TIssue)=>{
    const {title,description,type} = issue
    const res = await pool.query(`
        insert into issues value($1,$2,$3)
        returning title, description,type`,[title,description,type])
        return res.rows[0]
}

export const getAllIssueFromDB =async()=>{
    const res = await pool.query(`
        select * from issues
        `)
        return res.rows[0]
}
export const getIssueByIdFromDB =async(id:string)=>{
    const res = await pool.query(`
        select * from issues where id = $1
        `,[id])
        return res.rows[0]
}

export  const updateIssueToDB = async(payload:UIssue,id:string)=>{
     const {type,description,title} = payload
    const res = await pool.query(`
        update issues set title = $1, description =$2, type = $3 where id = $4
        returning *`,[title,description,type,id])
        return res.rows[0]
}
export const deleteIssueFromDB = async (id:string)=>{
    const res = await pool.query(`
        delete from issues where id =$1
        `,[id])
        return res.rows[0]
}