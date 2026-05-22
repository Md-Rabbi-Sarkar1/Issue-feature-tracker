import { Router } from "express";
import { createIssue, deleteIssue, getAllIssues, getIssueById, updateIssue } from "./issue.controller";
import { auth, authorizeRole, canDeleteIssue, canUpdateIssue } from "../../middleware/auth";

const router = Router();
router.post('/issues', auth, authorizeRole("contributor", "maintainer"), createIssue)
router.get('/issues', getAllIssues)
router.get('/issues/:id', getIssueById)
router.put('/issues/:id', auth, canUpdateIssue, updateIssue)
router.delete('/issues/:id', auth, canDeleteIssue, deleteIssue)

export const issueRoute = router