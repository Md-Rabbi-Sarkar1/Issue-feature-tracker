import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";
import { getUserById } from "../modules/auth/auth.service";
import type { Role } from "../types";
import { pool } from "../db";


export const auth = async (req: Request, res: Response, next: NextFunction) => {
   const token = req.headers.authorization
   if (!token) {
      return sendResponse(res, { message: "token not found" }, 401)
   }
   const payload = verifyToken(token)
   if (!payload) {
      return sendResponse(res, { message: "Invalid Token" }, 401)
   }
   const user = await getUserById(payload.id)
   if (!user) {
      return sendResponse(res, { message: "User not found" }, 404)
   }
   req.user = user
   next()
}

export const authorizeRole = (...roles: Role[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
         return sendResponse(res, { message: "unothorize" }, 401)
      }
      if (!roles.includes(req.user.role)) {
         return sendResponse(res, { message: "Have no permission" }, 403)
      }
      return next()
   }
}

export const canUpdateIssue = async (req: Request, res: Response, next: NextFunction) => {
   const issueId = (req.params.id)
   const resIssue = await pool.query(`
      select reporter_id,status from issues where id = $1
      `, [issueId])
   const issue = resIssue.rows[0]
   if (!issue) {
      return sendResponse(res, { message: "Issue not found" })
   }
   const user = req.user
   if (user?.role === "maintainer") {
      return next();
   }
   const isOwner = issue.reporter_id === user?.id
   const isOpen = issue.status === "open"
   if (user?.role === "contributor" && isOwner && isOpen) {
      return next()
   }
   return sendResponse(res, { message: "Forbidden" }, 403)
}

export const canDeleteIssue = async (req: Request, res: Response, next: NextFunction) => {
   const issueId = (req.params.id)
   const resIssue = await pool.query(`
      select reporter_id,status from issues where id = $1
      `, [issueId])
   const issue = resIssue.rows[0]
   if (!issue) {
      return sendResponse(res, { message: "Issue not found" })
   }
   const user = req.user
   if (user?.role === "maintainer") {
      return next();
   }
   return sendResponse(res, { message: "Forbidden" }, 403)
}