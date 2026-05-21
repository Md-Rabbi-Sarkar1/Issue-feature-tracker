import { Router } from "express";
import { createIssue, deleteIssue, getAllIssues, getIssueById, updateIssue } from "./issue.controller";
import { getAllIssueFromDB } from "./issue.service";
import { auth } from "../../middleware/auth";

const router = Router();
router.post('/issues',auth,createIssue)
router.get('/issues',getAllIssues)
router.get('/issues/:id',getIssueById)
router.put('/issues/:id',updateIssue)
router.delete('/issues/:id',deleteIssue)

export const issueRoute = router