const api = require("express").Router();
const http = require("http");

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
    .on("error", (e) => {
      morgan(":date[clf] :method :url :status :response-time ms", {
        stream: fs.createWriteStream(path.join(root, "logs", "error.log"), {
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
      stream: fs.createWriteStream(path.join(root, "logs", "error.log"), {
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
        stream: fs.createWriteStream(path.join(root, "logs", "error.log"), {
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
      stream: fs.createWriteStream(path.join(root, "logs", "error.log"), {
        flags: "a",
      }),
    });
    callBack(500, err);
  });

  request.end();
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

api.get("/moderators", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  getRequest("localhost", "/moderators", 3000, (statusCode, response) => {
    if (statusCode == 500) next(response);
    else res.status(statusCode).json(response);
  });
});

api.post("/moderators", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
    "/moderators",
    3000,
    requestBody,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
});

api.get("/moderators/:emailAddress", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  getRequest(
    "localhost",
    "/moderators/" + req.params.emailAddress,
    3000,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.put("/moderators/:emailAddress", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
    "/moderators/" + req.params.emailAddress,
    3000,
    requestBody,
    (statusCode, response) => {
      if (statusCode == 500) next(response);
      else res.status(statusCode).json(response);
    }
  );
});

api.delete("/moderators/:emailAddress", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  deleteRequest(
    "localhost",
    "/moderators/" + req.params.emailAddress,
    3000,
    (statusCode, response) => {
      res.status(statusCode).json(response);
    }
  );
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
          putRequest(
            "localhost",
            "/api/reports/id/" + prevReport["ID"],
            8080,
            JSON.stringify({
              reportCount: prevReport["Report Count"],
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
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
    "/verify",
    8082,
    requestBody,
    (statusCode, response) => {
      res.status(statusCode).json(response);
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
