

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
dotenv.config({
  quiet: true
});
var config = {
  connectionString: process.env.connectionString,
  port: process.env.port,
  accessSecret: process.env.accessSecret
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connectionString
});
var initDB = async () => {
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
    `);
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
        `);
  console.log("Database connected");
};

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
var createUser = async (user) => {
  const { name, email, password, role } = user;
  const hash = await bcrypt.hash(password, 10);
  const res = await pool.query(`
        insert into users (name, email, password, role) values ($1,$2,$3,$4)
        returning id, name, email, role, created_at, updated_at`, [name, email, hash, role]);
  return res.rows[0];
};
var validateUser = async (email, pass) => {
  const res = await pool.query(`
            select * from users where email = $1
            `, [email]);
  if (!res.rows.length) {
    return null;
  }
  const { password, ...user } = res.rows[0];
  const isValid = await bcrypt.compare(pass, password);
  return isValid ? user : null;
};
var getUserById = async (id) => {
  const res = await pool.query(`
            select * from users where id = $1
            `, [id]);
  return res.rows[0];
};

// src/utils/sendResponse.ts
function sendResponse(res, { message, data, error: error2 }, status = 200) {
  res.status(status).json({
    success: error2 ? false : true,
    message,
    data: error2 ? void 0 : data
  });
}

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var signToken = (payload) => {
  const accessToken = jwt.sign(payload, config_default.accessSecret, {
    expiresIn: "2d"
  });
  return { accessToken };
};
var verifyToken = (token) => {
  const decode = jwt.verify(token, config_default.accessSecret);
  return decode;
};

// src/modules/auth/auth.controller.ts
var signUp = async (req, res) => {
  const user = await createUser(req.body);
  if (!user) {
    sendResponse(res, { message: "User not created" }, 400);
    return;
  }
  sendResponse(res, { message: "User registered successfully", data: user }, 201);
};
var logIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await validateUser(email, password);
  if (!user) {
    sendResponse(res, { message: "Invalid email or pass" }, 401);
    return;
  }
  const { accessToken } = signToken(user);
  res.cookie("accessToken", accessToken, {
    sameSite: "lax",
    httpOnly: true,
    secure: false
  });
  const result = {
    token: accessToken,
    user
  };
  return sendResponse(res, { message: "User login successfully", data: result }, 201);
};

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/auth/signup", signUp);
router.post("/auth/login", logIn);
var authRoute = router;

// src/app.ts
import cookieParser from "cookie-parser";

// src/modules/issue/issue.route.ts
import { Router as Router2 } from "express";

// src/modules/issue/issue.service.ts
var createIssueIntoDB = async (issue, reporter_id) => {
  const { title, description, type } = issue;
  const res = await pool.query(`
        insert into issues (title,description,type,reporter_id) values ($1,$2,$3,$4)
        returning id, title, description,type,status,reporter_id,created_at,updated_at`, [title, description, type, reporter_id]);
  return res.rows[0];
};
var getAllIssueFromDB = async (query) => {
  const resIssue = await pool.query(`
        select * from issues order by created_at desc
        `);
  const issues = resIssue.rows;
  const reporterIds = issues.map(
    (issue) => issue.reporter_id
  );
  const resUser = await pool.query(`
            select id,name,role from users where id =any($1)
            `, [reporterIds]);
  const userMap = /* @__PURE__ */ new Map();
  resUser.rows.forEach((user) => {
    userMap.set(user.id, user);
  });
  const issuesReportter = resIssue.rows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userMap.get(issue.reporter_id) ? {
      id: userMap.get(issue.reporter_id).id,
      name: userMap.get(issue.reporter_id).name,
      role: userMap.get(issue.reporter_id).role
    } : null,
    created_at: issue.created_at,
    updated_at: issue.updated_at
  }));
  return issuesReportter;
};
var getIssueByIdFromDB = async (id) => {
  const resIssue = await pool.query(`
        select * from issues where id =$1
        `, [id]);
  const issue = resIssue.rows[0];
  if (!issue) {
    return null;
  }
  const { reporter_id } = issue;
  const resUser = await pool.query(`
            select id,name,role from users where id =$1
            `, [reporter_id]);
  const reporter = resUser.rows[0];
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
};
var updateIssueToDB = async (payload, id) => {
  const { type, description, title } = payload;
  const res = await pool.query(`
        update issues set title = $1, description =$2, type = $3 where id = $4
        returning *`, [title, description, type, id]);
  return res.rows[0];
};
var deleteIssueFromDB = async (id) => {
  const res = await pool.query(`
        delete from issues where id =$1
        `, [id]);
  return res.rows[0];
};

// src/modules/issue/issue.controller.ts
var createIssue = async (req, res) => {
  const issue = req.body;
  const reporter_id = req?.user.id;
  const result = await createIssueIntoDB(issue, reporter_id);
  if (!result) {
    return sendResponse(res, { message: "Issue not create" }, 400);
  }
  return sendResponse(res, { message: "Issue created successfully", data: result }, 201);
};
var getAllIssues = async (req, res) => {
  const result = await getAllIssueFromDB(req.query);
  if (!result) {
    return sendResponse(res, { message: "Issues rettrived unsuccessfull" }, 401);
  }
  return sendResponse(res, { data: result }, 200);
};
var getIssueById = async (req, res) => {
  const { id } = req.params;
  const result = await getIssueByIdFromDB(id);
  if (!result) {
    return sendResponse(res, { message: "Issues rettrived unsuccessfull" }, 401);
  }
  return sendResponse(res, { data: result }, 200);
};
var updateIssue = async (req, res) => {
  const { id } = req.params;
  const { title, description, type } = req.body;
  const result = await updateIssueToDB(req.body, id);
  if (!result) {
    return sendResponse(res, { message: " Issue updated unsuccessfull" }, 401);
  }
  return sendResponse(res, { message: "Issue updated successfully", data: result }, 200);
};
var deleteIssue = async (req, res) => {
  const { id } = req.params;
  const result = await deleteIssueFromDB(id);
  if (!result) {
    return sendResponse(res, { message: "Delete issue unsuccessfull" }, 401);
  }
  return sendResponse(res, { message: "Delete issue successfull" }, 200);
};

// src/middleware/auth.ts
import "console";
var auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendResponse(res, { message: "Token not found" }, 401);
  }
  const payload = verifyToken(token);
  if (!payload) {
    return sendResponse(res, { message: "Invalid Token" }, 401);
  }
  const user = await getUserById(payload.id);
  if (!user) {
    return sendResponse(res, { message: "User not found" }, 404);
  }
  req.user = user;
  next();
};
var authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, { message: "Unothorize" }, 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, { message: "Have no permission" }, 403);
    }
    return next();
  };
};
var canUpdateIssue = async (req, res, next) => {
  const issueId = req.params.id;
  const resIssue = await pool.query(`
      select reporter_id,status from issues where id = $1
      `, [issueId]);
  const issue = resIssue.rows[0];
  if (!issue) {
    return sendResponse(res, { message: "Issue not found" }, 404);
  }
  const user = req.user;
  if (user?.role === "maintainer") {
    return next();
  }
  const isOwner = issue.reporter_id === user?.id;
  const isOpen = issue.status === "open";
  if (user?.role === "contributor" && isOwner && isOpen) {
    return next();
  }
  return sendResponse(res, { message: "Forbidden" }, 403);
};
var canDeleteIssue = async (req, res, next) => {
  const issueId = req.params.id;
  const resIssue = await pool.query(`
      select reporter_id,status from issues where id = $1
      `, [issueId]);
  const issue = resIssue.rows[0];
  if (!issue) {
    return sendResponse(res, { message: "Issue not found" }, 404);
  }
  const user = req.user;
  if (user?.role === "maintainer") {
    return next();
  }
  return sendResponse(res, { message: "Forbidden" }, 403);
};

// src/modules/issue/issue.route.ts
var router2 = Router2();
router2.post("/issues", auth, authorizeRole("contributor", "maintainer"), createIssue);
router2.get("/issues", getAllIssues);
router2.get("/issues/:id", getIssueById);
router2.put("/issues/:id", auth, canUpdateIssue, updateIssue);
router2.delete("/issues/:id", auth, canDeleteIssue, deleteIssue);
var issueRoute = router2;

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      statusCode,
      details: err.details || null
    }
  });
};

// src/app.ts
var app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api", authRoute);
app.use("/api", issueRoute);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`Server is running on port ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map