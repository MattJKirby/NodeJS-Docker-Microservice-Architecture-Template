"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
/* Package version from package.json */
const packageVersion = process.env.npm_package_version;
/* Package name from package.json */
const packageName = process.env.npm_package_name;
/** Port number */
const PORT = 3000;
/* Logger */
/* Configuration options for different environments */
exports.Configuration = {
    development: {
        name: "Home [DEV] ",
        PORT,
        packageVersion,
        packageName,
    },
    production: {
        name: "Home",
        PORT,
        packageVersion,
        packageName,
    },
};
