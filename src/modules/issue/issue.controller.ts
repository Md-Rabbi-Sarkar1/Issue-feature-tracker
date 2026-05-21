import type { Request, Response } from "express";
import { createIssueIntoDB, deleteIssueFromDB, getAllIssueFromDB, getIssueByIdFromDB, updateIssueToDB } from "./issue.service";
import { sendResponse } from "../../utils/sendResponse";


export const createIssue = async (req: Request, res: Response) => {
    const issue = req.body
    const reporter_id = req?.user.id
    const result = await createIssueIntoDB(issue,reporter_id)
    if (!result) {
        return sendResponse(res, { message: "Issue not create" }, 400)
    }
    return sendResponse(res, { message: "Issue created successfully", data: result }, 201)
}
export const getAllIssues = async (req: Request, res: Response) => {
    const result = await getAllIssueFromDB()
    if (!result) {
        return sendResponse(res, { message: "issues rettrived unsuccessfull" }, 401)
    }
    return sendResponse(res, { message: "Issue retrived successfull", data: result }, 201)

}
export const getIssueById = async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await getIssueByIdFromDB(id as string)
    if (!result) {
        return sendResponse(res, { message: "issues rettrived unsuccessfull" }, 401)
    }
    return sendResponse(res, { message: "Issue retrived successfull", data: result }, 200)
}
export const updateIssue = async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, description, type } = req.body
    const result = await updateIssueToDB(req.body, id as string)
    if (!result) {
        return sendResponse(res, { message: "updated issue unsuccessfull" }, 401)
    }
    return sendResponse(res, { message: "updated retrived successfull",data:result }, 200)
}

export const deleteIssue = async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await deleteIssueFromDB(id as string)
    if (!result) {
        return sendResponse(res, { message: "delete issue unsuccessfull" }, 401)
    }
    return sendResponse(res, { message: "delete issue successfull" }, 200)
}
