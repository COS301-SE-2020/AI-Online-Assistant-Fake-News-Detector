const api = require("express").Router();
const http = require("http");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const path = require("path");
const config = require("../../Util/config");
const root = require(path.join("../", "../", "Util", "path"));
const Logger = require("../../winston");
const logger = new Logger(api);
const fs = require("fs");
const shell = require("shelljs");
const { response } = require("express");
const nn_server = [];

const getRequest = (_host, _path, _port, callBack) => {
  const request = http
    .request(
      {
        host: _host,
        port: _port,
        path: _path,
        method: "GET",
      },
      (response) => {
        response.setEncoding("utf-8");
        let responseString = "";
        response.on("data", (chunk) => {
          responseString += chunk;
        });

        response.on("end", () => {
          if (responseString === "") responseString = "{}";
          callBack(response.statusCode, JSON.parse(responseString));
        });
      }
    )
    .on("error", (err) => {
      morgan(":date[clf] :method :url :status :response-time ms", {
        stream: fs.createWriteStream(path.join(root, "logfiles", "error.log"), {
          flags: "a",
        }),
      });
      callBack(500, err);
    });

  request.end();
};

const postRequest = (_host, _path, _port, _params, callBack) => {
  const request = http.request(
    {
      host: _host,
      port: _port,
      path: _path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(_params),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        if (responseString === "") responseString = "{}";
        return callBack(response.statusCode, JSON.parse(responseString));
      });
    }
  );
  request.on("error", (err) => {
    morgan(":date[clf] :method :url :status :response-time ms", {
      stream: fs.createWriteStream(path.join(root, "logfiles", "error.log"), {
        flags: "a",
      }),
    });
    callBack(500, err);
  });

  request.write(_params);
  request.end();
};

const putRequest = (_host, _path, _port, params, callBack) => {
  let req = http
    .request(
      {
        host: _host,
        port: _port,
        path: _path,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": params.length,
        },
      },
      (response) => {
        response.setEncoding("utf-8");
        let responseString = "";
        response.on("data", (chunk) => {
          responseString += chunk;
        });
        response.on("end", () => {
          if (responseString === "") responseString = "{}";
          return callBack(response.statusCode, JSON.parse(responseString));
        });
      }
    )
    .on("error", (err) => {
      morgan(":date[clf] :method :url :status :response-time ms", {
        stream: fs.createWriteStream(path.join(root, "logfiles", "error.log"), {
          flags: "a",
        }),
      });
      callBack(500, err);
    });

  req.write(params);
  req.end();
};

const deleteRequest = (_host, _path, _port, callBack) => {
  const request = http.request(
    {
      host: _host,
      port: _port,
      path: _path,
      method: "DELETE",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        if (responseString === "") responseString = "{}";
        return callBack(response.statusCode, JSON.parse(responseString));
      });
    }
  );

  request.on("error", (err) => {
    morgan(":date[clf] :method :url :status :response-time ms", {
      stream: fs.createWriteStream(path.join(root, "logfiles", "error.log"), {
        flags: "a",
      }),
    });
    callBack(500, err);
  });

  request.end();
};

const validateUser = (token, callBack) => {
  try {
    jwt.verify(token, config.secretKey, (err, decode) => {
      if (err) {
        morgan(":date[clf] :method :url :status :response-time ms", {
          stream: fs.createWriteStream(
            path.join(root, "logfiles", "error.log"),
            {
              flags: "a",
            }
          ),
        });
        callBack(false, 500, err);
      }

      getRequest(
        "localhost",
        "/Users/id/" + decode.id,
        3000,
        (statusCode, response) => {
          if (
            response.response.User !== undefined &&
            response.response.User.ID === decode.id &&
            response.response.User["Authentication Level"] == 3
          )
            callBack(true);
          else if (
            response.response.User !== undefined &&
            response.response.User.ID === decode.id &&
            (response.response.User["Authentication Level"] == 1 ||
              response.response.User["Authentication Level"] == 2)
          )
            callBack(false);
          else callBack(false);
        }
      );
    });
  } catch (error) {
    morgan(":date[clf] :method :url :status :response-time ms", {
      stream: fs.createWriteStream(path.join(root, "logfiles", "error.log"), {
        flags: "a",
      }),
    });
    callBack(false, 500, "Internal Server Error");
  }
};

/**
 * @description base get request route. Reroutes teh api call to the api server
 * @author Stuart Barclay
 */
api.get("/", (req, res) => {
  res.status(200).json({ Response: "Hello from the API" });
});

/**
 * @description base get request route. Reroutes the api call to the api server, gets all sources in the db
 * @author Stuart Barclay
 */

api.get("/sources", (req, res, next) => {
  getRequest("localhost", "/sources", 3000, (statusCode, response) => {
    if (statusCode == 500) next(response);
    else res.status(statusCode).json(response);
  });
});

/**
 * @description base post request route. Reroutes the api call to the api server. adds new source to db.
 * @author Stuart Barclay
 */

api.post("/sources", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  postRequest(
    "localhost",
    "/sources",
    3000,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

/**
 * @description Get request to get a single source based on name
 * @author Quinton Coetzee
 */

api.get("/sources/name/:sourceName", (req, res, next) => {
  getRequest(
    "localhost",
    "/sources/name/" + encodeURI(req.params.sourceName),
    3000,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

/**
 * @description base get request route. Reroutes the api call to the api server, gets all sources in the db
 * @author Stuart Barclay
 */

api.get("/sources/id/:sourceId", (req, res, next) => {
  getRequest(
    "localhost",
    "/sources/id/" + req.params.sourceId,
    3000,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

/**
 * @description base post request route. Reroutes the api call to the api server. adds new source to db.
 * @author Stuart Barclay
 */

api.put("/sources/id/:sourceId", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  putRequest(
    "localhost",
    "/sources/id/" + req.params.sourceId,
    3000,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

/**
 * @description API call to delete a source with the given id.
 * @author Stuart Barclay
 */

api.delete("/sources/id/:sourceId", (req, res, next) => {
  deleteRequest(
    "localhost",
    "/sources/id/" + req.params.sourceId,
    3000,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

/**
 * @description base get request route. Reroutes the api call to the api server, gets all facts in the db
 * @author Stuart Barclay
 */

api.get("/facts", (req, res, next) => {
  getRequest("localhost", "/facts", 3000, (statusCode, response) => {
    if (statusCode == 500) next(response);
    else res.status(statusCode).json(response);
  });
});

/**
 * @description base post request route. Reroutes the api call to the api server. adds new fact to db.
 * @author Stuart Barclay
 */

api.post("/facts", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  postRequest(
    "localhost",
    "/facts",
    3000,
    requestBody,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

/**
 * @description base get request route. Reroutes the api call to the api server, gets specific fact from the db
 * @author Stuart Barclay
 */

api.get("/facts/:factId", (req, res, next) => {
  getRequest(
    "localhost",
    "/facts/" + req.params.factId,
    3000,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

/**
 * @description API call to delete a source with the given id.
 * @author Stuart Barclay
 */

api.delete("/facts/:factId", (req, res, next) => {
  deleteRequest(
    "localhost",
    "/facts/" + req.params.factId,
    3000,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

/**
 * @description API call to fetch all Users.
 * @author Stuart Barclay
 */

api.get("/Users", (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({
      response: {
        message: "Not authorised",
        success: false,
      },
    });

  validateUser(token, (valid, statusCode, response) => {
    if (!valid && statusCode === 500) return next(response);
    else if (!valid)
      return res.status(401).json({
        response: {
          message: "Not authorised",
          success: false,
        },
      });

    getRequest("localhost", "/Users", 3000, (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    });
  });
});

/**
 * @description API call to create a new moderator
 * @author Stuart Barclay
 */

api.post("/Users/register", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    return next(error);
  }
  postRequest(
    "localhost",
    "/Users/register",
    3000,
    requestBody,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

/**
 * @description API call to request moderator access
 * @author Stuart Barclay
 */

api.post("/Users/requestModeratorAccess", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    return next(error);
  }
  postRequest(
    "localhost",
    "/api/sendEmail",
    8080,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

/**
 * @description API call to allow a moderator to login
 * @author Stuart Barclay
 */

api.post("/Users/login", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  postRequest(
    "localhost",
    "/Users/login",
    3000,
    requestBody,
    (statusCode, response) => {
      if (response.response.success == true) {
        let token = jwt.sign({ id: response.response.id }, config.secretKey, {
          expiresIn: 10800,
        });
        response.response.token = token;
        res.status(statusCode).json(response);
      } else res.status(statusCode).json(response);
    }
  );
});

api.get("/Users/emailAddress/:emailAddress", (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({
      response: {
        message: "Not authorised",
        success: false,
      },
    });

  validateUser(token, (valid, statusCode, response) => {
    if (!valid && statusCode === 500) return next(response);
    else if (!valid)
      return res.status(401).json({
        response: {
          message: "Not authorised",
          success: false,
        },
      });

    getRequest(
      "localhost",
      "/Users/emailAddress/" + req.params.emailAddress,
      3000,
      (statusCode, response) => {
        if (statusCode == 500) next(response);
        else res.status(statusCode).json(response);
      }
    );
  });
});

api.get("/Users/id/:moderatorId", (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({
      response: {
        message: "Not authorised",
        success: false,
      },
    });

  validateUser(token, (valid, statusCode, response) => {
    if (!valid && statusCode === 500) return next(response);
    else if (!valid)
      return res.status(401).json({
        response: {
          message: "Not authorised",
          success: false,
        },
      });

    getRequest(
      "localhost",
      "/Users/" + req.params.emailAddress,
      3000,
      (statusCode, response) => {
        if (statusCode == 500) next(response);
        else res.status(statusCode).json(response);
      }
    );
  });
});

api.put("/Users/:emailAddress", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  putRequest(
    "localhost",
    "/Users/" + req.params.emailAddress,
    3000,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.delete("/Users/:emailAddress", (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({
      response: {
        message: "Not authorised",
        success: false,
      },
    });

  validateUser(token, (valid, statusCode, response) => {
    if (!valid && statusCode === 500) return next(response);
    else if (!valid)
      return res.status(401).json({
        response: {
          message: "Not authorised",
          success: false,
        },
      });
    deleteRequest(
      "localhost",
      "/Users/" + encodeURI(req.params.emailAddress),
      3000,
      (statusCode, response) => {
        res.status(statusCode).json(response);
      }
    );
  });
});

api.get("/reports", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  getRequest("localhost", "/reports", 3000, (statusCode, response) => {
    if (statusCode == 500) next(response);
    else res.status(statusCode).json(response);
  });
});

api.get("/reports/update", (req, res, next) => {
  let data = "";
  getRequest("localhost", "/reports/active/1", 3000, (statusCode, data) => {
    if (data) {
      let prevReport = data.response.Reports[0];
      for (report of data.response.Reports) {
        if (
          report["Report Data"].toLowerCase() ===
            prevReport["Report Data"].toLowerCase() &&
          report["ID"] !== prevReport["ID"]
        ) {
          ++prevReport["Report Count"];
          prevReport["Reported By"].push(report["Reported By"][0]);
          putRequest(
            "localhost",
            "/api/reports/id/" + prevReport["ID"],
            8080,
            JSON.stringify({
              reportCount: prevReport["Report Count"],
              reportedBy: prevReport["reportedBy"],
            }),
            (statusCode, _data) => {}
          );
          putRequest(
            "localhost",
            "/api/reports/id/" + report["ID"],
            8080,
            JSON.stringify({
              bActive: 0,
            }),
            (statusCode, _data) => {}
          );
        } else {
          prevReport = report;
        }
      }
      setTimeout(() => {
        getRequest(
          "localhost",
          "/reports/active/1",
          3000,
          (statusCode, data) => {
            if (data !== "") res.status(200).json(data);
            else {
              let error = new Error("No Updates Occurred Due To An Error");
              error.status = 500;
              next(error);
            }
          }
        );
      }, 2000);
    }
  });
});

api.post("/reports", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  let requestBody = "";
  try {
    req.body.description = req.body.description
      .split(" ")
      .filter((e) => e != "")
      .join(" ");
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  postRequest(
    "localhost",
    "/reports",
    3000,
    requestBody,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

api.get("/reports/id/:id", (req, res, next) => {
  getRequest(
    "localhost",
    "/reports/id/" + req.params.id,
    3000,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.get("/reports/active/:active", (req, res, next) => {
  getRequest(
    "localhost",
    "/reports/active/" + req.params.active,
    3000,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.get("/reports/type/:type", (req, res, next) => {
  getRequest(
    "localhost",
    "/reports/type/" + req.params.type,
    3000,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.put("/reports/id/:id", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  putRequest(
    "localhost",
    "/reports/id/" + req.params.id,
    3000,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.put("/reports/active/:active", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  putRequest(
    "localhost",
    "/reports/active/" + req.params.active,
    3000,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.put("/reports/type/:type", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  putRequest(
    "localhost",
    "/reports/type/" + req.params.type,
    3000,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.delete("/reports/id/:id", (req, res, next) => {
  deleteRequest(
    "localhost",
    "/reports/id/" + req.params.id,
    3000,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

api.delete("/reports/active/:active", (req, res, next) => {
  deleteRequest(
    "localhost",
    "/reports/active/" + req.params.active,
    3000,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

api.post("/verify", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  // Checks if there is an idle server
  let freeServerIndex = nn_server.findIndex((server) => server.busy === false);

  // There is an idle instance
  if (freeServerIndex !== -1) {
    nn_server[freeServerIndex].busy = true;
    let freeCount = nn_server.filter((e) => e.busy === false).length;

    // Start new instance async if no free servers
    if (freeCount === 0)
      getRequest(
        "localhost",
        "/api/start/" + (nn_server[nn_server.length - 1].port + 1),
        "8080",
        (responseCode, response) => {}
      );
    postRequest(
      "localhost",
      "/verify",
      nn_server[freeServerIndex].port,
      requestBody,
      (statusCode, response) => {
        nn_server[freeServerIndex].busy = false;
        res.status(statusCode).json(response);
      }
    );
  }
  // There are no free instances, create and tell it to be busy
  else if (freeServerIndex === -1 && nn_server.length < 10) {
    // Start new instance with incremented port
    getRequest(
      "localhost",
      "/api/start/" + (nn_server[nn_server.length - 1].port + 1),
      "8080",
      (responseCode, startResponse) => {
        startResponse = nn_server.length - 1;
        // Tell it to be busy
        nn_server[startResponse].busy = true;
        postRequest(
          "localhost",
          "/verify",
          nn_server[nn_server.length - 1].port,
          requestBody,
          (statusCode, response) => {
            nn_server[startResponse].busy = false;
            res.status(statusCode).json(response);
          }
        );
      }
    );
  } // if no idle servers and all 10 instances have been created, direct to first instance
  else {
    postRequest(
      "localhost",
      "/verify",
      nn_server[0].port,
      requestBody,
      (statusCode, response) => {
        nn_server[0].busy = false;
        res.status(statusCode).json(response);
      }
    );
  }
});

// Fetches

api.get("/training", (req, res, next) => {
  getRequest("localhost", "/training", 3000, (statusCode, response) => {
    if (statusCode == 500) next(response);
    else res.status(statusCode).json(response);
  });
});

api.post("/training/range", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  postRequest(
    "localhost",
    "/training/range",
    3000,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

// Creates a new training entry

api.post("/training", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  postRequest(
    "localhost",
    "/training",
    3000,
    requestBody,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

api.delete("/training/:trainingId", (req, res, next) => {
  deleteRequest(
    "localhost",
    "/training/" + req.params.trainingId,
    3000,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

api.get("/nnModels", (req, res, next) => {
  getRequest("localhost", "/nnModels", 3000, (statusCode, response) => {
    if (statusCode == 500) next(response);
    else res.status(statusCode).json(response);
  });
});

api.post("/nnModels", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  postRequest(
    "localhost",
    "/nnModels",
    3000,
    requestBody,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

api.get("/nnModels/:modelName", (req, res, next) => {
  getRequest(
    "localhost",
    "/nnModels/" + encodeURI(req.params.modelName),
    3000,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.delete("/nnModels/:modelId", (req, res, next) => {
  deleteRequest(
    "localhost",
    "/nnModels/" + req.params.modelId,
    3000,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

api.get("/start/:port", (req, res, next) => {
  try {
    shell.cd(path.join(root, "nn_server"));
    shell.exec(
      "python nn_server.py " + req.params.port,
      (err, stdout, stderr) => {
        if (err) throw new Error(err);
        logger.info("New nn_server image created on port " + req.params.port);
        nn_server.push({ port: Number(req.params.port), busy: false });
        res.sendStatus(204);
      }
    );
    nn_server.push({ port: Number(req.params.port), busy: false });
  } catch (err) {
    next(err);
  }
});

api.get("/close/:port", (req, res, next) => {
  logger.info("Closing nn_server image on port " + req.params.port);
  postRequest(
    "localhost",
    "/shutdown",
    req.params.port,
    "",
    (statusCode, response) => {
      if (statusCode == 200) {
        let index = nn_server.findIndex((ele, i) => {
          if (ele.port == req.params.port) return i;
        });
        try {
          nn_server.splice(index, 1);
          res.sendStatus(statusCode).json(response);
        } catch (error) {}
      } else {
        next(response);
      }
    }
  );
});

api.post("/sendEmail", (req, res, next) => {
  config.transporter.sendMail(
    {
      from: "Artifact<" + config.emailAddress + ">",
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.body,
    },
    (error, info) => {
      if (error) {
        next(error);
      } else {
        logger.info("Email sent: " + info.response);
        res.sendStatus(204);
      }
    }
  );
});

/**
 * @description API calls done incorrectly will arrive at this route and be dismissed.
 * @author Stuart Barclay
 */

api.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//handles all other errors
api.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = api;
