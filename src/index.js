import {readDirExcels} from './components/ExcelRead.js';


export function routers(app) {

     app.route("/test").get((req, res) => {
          res.send("ok!====!!");
     });

     app.route("/readExcel").get((req, res) => {
          readDirExcels("/software/workspace/excelToJson", res);
     });
};