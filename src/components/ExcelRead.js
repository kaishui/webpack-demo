import * as path from 'path';
import * as fs from 'fs';
import excelToJson from 'convert-excel-to-json';
import _ from 'lodash';
// import {convertExcel} from 'excel-as-json';
import json2xls from 'json2xls';


export let setVal = (val) =>{
     return _.isUndefined(val) ? "" : val
}

function keysort(key,sortType){
     return function(a,b){
         return sortType ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
     }
 }

export function readDirExcels(pathName) {


     fs.readdir(pathName, function (err, files) {
          let targetArr = new Array();
          // console.log(files);
          for (let index in files) {
               let filePath = pathName + "/" + files[index];
               let result = excelToJson({
                    source: fs.readFileSync(filePath)
               });

               Object.keys(result).forEach(resultKey => {
                    let keys = result[resultKey];
                    let target = {};
                    for (let key of keys) {
                         console.log(key);
                         // 1. A column
                         if (key['A'] && key['A'].startsWith('编号：')) {
                              target['编号'] = key['A'].replace("编号：", "");
                         }
                         //2. B column
                         if (_.isEqual(key['A'], '社会团体名称')) {
                              target['社会团体名称'] = key['B'];
                         }

                         // 3. C & D
                         if (_.isEqual(key['A'], '业务主管单位')) {
                              target['业务主管单位'] = key['B'];
                              target['类    别'] = key['E'];
                         }
                         //3.E / F column
                         if (_.isEqual(key['A'], '联系人')) {
                              target['联系人'] = key['B'];
                              target['联系电话'] = key['E'];
                         }
                         // 4. g
                         if (_.isEqual(key['A'], '基本信息') && _.isUndefined(key['C'])) {
                              target['基本信息'] = setVal(key['B']);
                         }

                         // 5. H / I
                         if (_.isEqual(key['B'], '基本信息') && _.isEqual(key['C'], "会员")) {
                              target['H'] = setVal(key['D']);
                              target['I'] = setVal(key['E']);

                         }

                         // 6. J / K
                         if (_.isEqual(key['C'], "理事会及负责人")) {
                              target['J'] = setVal(key['D']);
                              target['K'] = setVal(key['E']);
                         }


                         // 7. L / M
                         if (_.isEqual(key['C'], "监事情况")) {
                              target['L'] = setVal(key['D']);
                              target['M'] = setVal(key['E']);
                         }
                    }
                    keysort(target, true);
                    targetArr.push(target);
               });
          }
          console.log(targetArr);

          var xls = json2xls(targetArr);

          fs.writeFileSync('data.xlsx', xls, 'binary');
     })
}
