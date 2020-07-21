const api = require("express").Router();
const http = require("http");

/**
 * @description base get request route. Reroutes teh api call to the api server
 * @author Stuart Barclay
 */
api.get("/", (req, res) => {
  res.status(200);
  res.json({ Response: "Hello from the API" });
});

/**
 * @description base get request route. Reroutes the api call to the api server, gets all sources in the db
 * @author Stuart Barclay
 */

api.get("/sources", (req, res, next) => {
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources",
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });
  request.end();
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
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );

  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });
  request.write(requestBody);
  request.end();
});

/**
 * @description Get request to get a single source based on name
 * @author Quinton Coetzee
 */

api.get("/sources/name/:sourceName", (req, res, next) => {
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources/name/" + req.params.sourceName,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});
/**
 * @description base get request route. Reroutes the api call to the api server, gets all sources in the db
 * @author Stuart Barclay
 */

api.get("/sources/id/:sourceId", (req, res, next) => {
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources/id/" + req.params.sourceId,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

/**
 * @description base post request route. Reroutes the api call to the api server. adds new source to db.
 * @author Stuart Barclay
 */

api.put("/sources/:sourceId", (req, res, next) => {
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources/" + req.params.sourceId,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );

  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });
  request.write(requestBody);
  request.end();
});

/**
 * @description API call to delete a source with the given id.
 * @author Stuart Barclay
 */

api.delete("/sources/:sourceId", (req, res, next) => {
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources/" + req.params.sourceId,
      method: "DELETE",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );

  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

/**
 * @description base get request route. Reroutes the api call to the api server, gets all facts in the db
 * @author Stuart Barclay
 */

api.get("/facts", (req, res, next) => {
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/facts",
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );

  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });
  request.end();
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
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/facts",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );

  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });
  request.write(requestBody);
  request.end();
});

/**
 * @description base get request route. Reroutes the api call to the api server, gets specific fact from the db
 * @author Stuart Barclay
 */

api.get("/facts/:factId", (req, res, next) => {
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/facts/" + req.params.factId,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );

  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

/**
 * @description API call to delete a source with the given id.
 * @author Stuart Barclay
 */

api.delete("/facts/:factId", (req, res, next) => {
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/facts/" + req.params.factId,
      method: "DELETE",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });

      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );

  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

api.get("/moderators", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/moderators",
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
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
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/moderators",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.write(requestBody);
  request.end();
});

api.get("/moderators/:emailAddress", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/moderators/" + req.params.emailAddress,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
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
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/moderators/" + req.params.emailAddress,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.write(requestBody);
  request.end();
});

api.delete("/moderators/:emailAddress", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/moderators/" + req.params.emailAddress,
      method: "DELETE",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

api.get("/reports", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports",
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

api.post("/reports", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  let requestBody = "";
  try {
    requestBody = JSON.stringify(req.body);
  } catch (e) {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  }
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.write(requestBody);
  request.end();
});

api.get("/reports/id/:id", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports/id/" + req.params.id,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

api.get("/reports/active/:active", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports/active/" + req.params.active,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

api.get("/reports/type/:type", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports/type/" + req.params.type,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
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
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports/id/" + req.params.id,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.write(requestBody);
  request.end();
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
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports/active/" + req.params.active,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.write(requestBody);
  request.end();
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
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports/type/" + req.params.type,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.write(requestBody);
  request.end();
});

api.delete("/reports/id/:id", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports/id/" + req.params.id,
      method: "DELETE",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
});

api.delete("/reports/active/:active", (req, res, next) => {
  /** Validate the user token from header before -> if can't res.status(403).json({"message": "You are not authorised to view this content."}), then check moderator level */
  const request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/reports/active/" + req.params.active,
      method: "DELETE",
    },
    (response) => {
      response.setEncoding("utf-8");
      let responseString = "";
      response.on("data", (chunk) => {
        responseString += chunk;
      });
      response.on("end", () => {
        res.status(response.statusCode).json(JSON.parse(responseString));
      });
    }
  );
  request.on("error", (e) => {
    let error = new Error(e.message);
    error.status = 500;
    next(error);
  });

  request.end();
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
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = api;
