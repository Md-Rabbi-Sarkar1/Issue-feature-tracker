import { Router } from "express";
import { createIssue, getAllIssues, getIssueById, updateIssue } from "./issue.controller";
import { getAllIssueFromDB } from "./issue.service";

const router = Router();
router.post('/issues',createIssue)
router.get('/issues',getAllIssues)
router.get('/issues/:id',getIssueById)
router.put('/issues/:id',updateIssue)
router.delete('/issues/:id',)

export const issueRoute = router