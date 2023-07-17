const swaggerJsDoc = require("swagger-jsdoc");
const port = process.env.PORT;

const swagger = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "WORKROOM SERVICE API",
      contact: { name: "Emmanuel C Mbagwu" },
      servers: [{ url: `http://localhost:${port}`}]
    },
  },
  apis: ['./src/swaggerDocs/**/*.yml']
};

module.exports = swaggerJsDoc(swagger);
