const nodemailer = require("nodemailer");
const morgan = require("morgan");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const root = require("./path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "5bits301@gmail.com",
    pass: "wugrex-Dysgu0-faxpeh",
  },
});

const HTTPSGetRequest = (_host, _path, _port, callBack) => {
  const request = https
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

const HTTPGetRequest = (_host, _path, _port, callBack) => {
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

const HTTPPostRequest = (_host, _path, _port, _params, callBack) => {
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

const HTTPSPostRequest = (_host, _path, _port, _params, callBack) => {
  const request = https.request(
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

const HTTPPutRequest = (_host, _path, _port, params, callBack) => {
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

const HTTPSPutRequest = (_host, _path, _port, params, callBack) => {
  let req = https
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

const HTTPDeleteRequest = (_host, _path, _port, callBack) => {
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

const HTTPSDeleteRequest = (_host, _path, _port, callBack) => {
  const request = https.request(
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

exports.secretKey = "5Bits2020";
exports.emailAddress = "5bits301@gmail.com";
exports.transporter = transporter;
exports.api_server_port = 8080;
exports.db_server_port = 3000;
exports.HTTPSGetRequest = HTTPSGetRequest;
exports.HTTPGetRequest = HTTPGetRequest;

exports.HTTPSPostRequest = HTTPSPostRequest;
exports.HTTPPostRequest = HTTPPostRequest;

exports.HTTPSPutRequest = HTTPSPutRequest;
exports.HTTPPutRequest = HTTPPutRequest;

exports.HTTPSDeleteRequest = HTTPSDeleteRequest;
exports.HTTPDeleteRequest = HTTPDeleteRequest;
