import type { TIssue, UIssue } from "../../types";
import { pool } from "../../db";

export const createIssueIntoDB = async (issue: TIssue, reporter_id: string) => {
    const { title, description, type } = issue
    const res = await pool.query(`
        insert into issues (title,description,type,reporter_id) values ($1,$2,$3,$4)
        returning id, title, description,type,status,reporter_id,created_at,updated_at`, [title, description, type, reporter_id])
    return res.rows[0]
}

export const getAllIssueFromDB = async (query: any) => {
    const resIssue = await pool.query(`
        select * from issues order by created_at desc
        `)
    const issues = resIssue.rows
    const reporterIds = issues.map(
        issue => issue.reporter_id
    )
    const resUser = await pool.query(`
            select id,name,role from users where id =any($1)
            `, [reporterIds])
    const userMap = new Map();
    resUser.rows.forEach(user => {
        userMap.set(user.id, user)
    })
    const issuesReportter = resIssue.rows.map(issue => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: userMap.get(issue.reporter_id) ?
            {
                id: userMap.get(issue.reporter_id).id,
                name: userMap.get(issue.reporter_id).name,
                role: userMap.get(issue.reporter_id).role,

            } : null,
        created_at: issue.created_at,
        updated_at: issue.updated_at
    }
    ))
    return issuesReportter
}

export const getIssueByIdFromDB = async (id: string) => {
    const resIssue = await pool.query(`
        select * from issues where id =$1
        `, [id])
    const issue = resIssue.rows[0]
    if (!issue) {
        return null
    }
    const { reporter_id } = issue
    const resUser = await pool.query(`
            select id,name,role from users where id =$1
            `, [reporter_id])
    const reporter = resUser.rows[0]
    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporter || null,
        created_at: issue.created_at,
        updated_at: issue.updated_at
    };
}

export const updateIssueToDB = async (payload: UIssue, id: string) => {
    const { type, description, title } = payload
    const res = await pool.query(`
        update issues set title = $1, description =$2, type = $3 where id = $4
        returning *`, [title, description, type, id])
    return res.rows[0]
}

export const deleteIssueFromDB = async (id: string) => {
    const res = await pool.query(`
        delete from issues where id =$1
        `, [id])
    return res
}