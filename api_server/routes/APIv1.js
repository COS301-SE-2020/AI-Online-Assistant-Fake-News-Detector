const express = require("express");
const api = express.Router();
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
  let request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources",
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf8");
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
  let request = http.request(
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
      response.setEncoding("utf8");
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
 * @description base get request route. Reroutes the api call to the api server, gets all sources in the db
 * @author Stuart Barclay
 */

api.get("/sources/:sourceId", (req, res, next) => {
  let request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources/" + req.params.sourceId,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf8");
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
  let request = http.request(
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
      response.setEncoding("utf8");
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
  let request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/sources/" + req.params.sourceId,
      method: "DELETE",
    },
    (response) => {
      response.setEncoding("utf8");
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
  let request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/facts",
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf8");
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
  let request = http.request(
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
      response.setEncoding("utf8");
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
  let request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/facts/" + req.params.factId,
      method: "GET",
    },
    (response) => {
      response.setEncoding("utf8");
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
  let request = http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/facts/" + req.params.factId,
      method: "DELETE",
    },
    (response) => {
      response.setEncoding("utf8");
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