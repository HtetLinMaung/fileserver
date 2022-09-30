const { default: http } = require("code-alchemy/http");

const verifyToken = async (token) => {
  return http.post(
    `${process.env.authservice_domain}/iam/v1/auth/verify-token`,
    {
      appId: process.env.app_id,
      accessKey: process.env.access_key,
      token,
    }
  );
};

exports.handleAuthorization = async (req) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.split(" ")[1]) {
    const err = new Error("Token is required!");
    err.status = 401;
    err.body = {
      code: 401,
      message: err.message,
    };
    throw err;
  }
  const [response, err] = await verifyToken(authHeader.split(" ")[1]);
  if (err) {
    throw err;
  }
  if (response.data.code != 200) {
    const err = new Error(response.data.message);
    err.status = response.data.code;
    err.body = response.data;
    throw err;
  }
  req.tokenPayload = response.data.data;
  req.body.createdby = req.tokenPayload.userId;
};
