import * as path from 'path';
import * as fs from 'fs';
import excelToJson from 'convert-excel-to-json';
import _ from 'lodash';
// import {convertExcel} from 'excel-as-json';
import json2xls from 'json2xls';

let commonName = { A: '监测评价内容', B: '指标内容', D: '相对规范', E: '存在问题' };

var columnTemplate = [
     { A: '报告（1）', name: [], value: [] },
     { A: '编号：20001', name: ['编号'], value: ["A"] },
     { A: '社会团体名称', B: '组织1', name: ['A'], value: ["B"] },
     { A: '业务主管单位', B: '单位1', D: '类    别', E: '社会组织', name: ['A', 'D'], value: ["B", "E"] },
     { A: '联系人', B: '张三', D: '联系电话', E: '123-234343、2323-34234324', name: ['A', 'D'], value: ['B', 'E'] },
     {
          A: '基本信息',
          B: 'X（社会团体名称）于X年X月X日正式成立，法定代表人是X，其（专职或兼职）秘书长由X担任。现有X个单位会员（和X个个人会员）。理事X个，常务理事X个，监事X名。现有工作人员X人，其中专职工作人员为X人。'
          , name: ['A'], value: ['B']
     },
     { A: '监测评价内容', B: '指标内容', D: '相对规范', E: '存在问题', name: [], value: [] },
     {
          B: '基本信息',
          C: '会员',
          D: '按章程规定发展会员，并达到规定人数。',
          E: '该组织为一般性社团，会员总数未达到规定要求，仅有个人会员*个，单位会员*个。（会员数不能少于50）\r\n' +
               '或：该组织为行业性社团，会员总数未达规定要求，单位会员仅有*个。（会员数不能少于50）\r\n' +
               '或：该组织为异地商会，会员总数未达规定要求，单位会员仅有*个。（会员数不能少于30）\r\n' +
               '或：该组织为异地商会，存在个人会员。\r\n' +
               '或：该组织为行业性社团，存在个人会员。',
     },
     {
          C: '理事会及负责人',
          D: '按章程要求设置理事会/监事会和常务理事会，符合《广东省社会团体法人治理结构与治理规则》。\r\n' +
               '法定代表人与会长不是同一人，法定代表人为X，会长为X，经批复，其原因为X（根据情况说明）。',
          E: '理事会（常务理事会）设置不符合要求，法定代表人与会长不是同一人，法定代表人为X，会长为X，其原因为X（未提供有关批复文件要根据情况说明）。\r\n' +
               '或：负责人中有70岁以上人员，且未提交相关审批文件。\r\n' +
               '或：未按要求设立理事会。\r\n' +
               '或：该社团有X个会员，X个理事，理事数超过会员数量的1/3。\r\n' +
               '或：理事数量未达到50人的情况下仍然设立常务理事X人。\r\n' +
               '或：理事数量为偶数X人，不符合规范，应为奇数。\r\n' +
               '或：理事数量少于7人，不符合规范。'
     },
     {
          C: '监事情况',
          D: '设立监事会。',
          E: '未设立监事会\r\n或：未设立监事会，监事人数为X人。\r\n或：监事数量为偶数X人，不符合规范，应为奇数。'
     },
     {
          C: '工作人员',
          D: '配有X个专职工作人员，签订劳动合同、购买社保。',
          E: '没有专职人员。\r\n或：有X专职工作人员未购买五险情况，原因为X。'
     },
     {
          B: '内部建设情况',
          C: '会议及换届情况',
          D: '按章程要求定期召开相关会议，并按时换届。',
          E: '未按章程要求召开相关会议（列出具体情况）/未按时换届\r\n' +
               '年度内没有召开会员大会/理事会/常务理事会/监事会，没有相应会议纪要。\r\n' +
               '或：未按时换届，该社团最近一次换届时间为X年X月，根据章程规定应于X年换届。未按时原因为X。\r\n' +
               '或：年度内召开了2次理事会/常务理事会/监事会，但只有1份会议纪要/但没有会议纪要。\r\n' +
               '或：年度内只召开1次理事会，召开次数低于规范要求。\r\n' +
               '或：年度内只召开1次理事会，召开次数低于规范要求，且没有提供会议纪要。\r\n' +
               '或：年度内只召开1次常务理事会，召开次数低于规范要求。\r\n' +
               '或：年度内只召开1次常务理事会，召开次数低于规范要求，且没有提供会议纪要。\r\n' +
               '或：年度内只召开1次监事会，召开次数低于规范要求。\r\n' +
               '或：年度内只召开1次监事会，召开次数低于规范要求，且没有提供会议纪要。\r\n' +
               '或：于同一天召开X次理事会/常务理事会/监事会。\r\n' +
               '或：监事会与理事会未分别独立召开。\r\n' +
               '或：监事成员没有列席理事会。\r\n' +
               '或：会议纪要没有理事（监事）签字。\r\n' +
               '或：会议纪要不规范，监事在理事处签名。\r\n' +
               '或：会费标准的通过未通过会员大会'
     },
     {
          C: '财务核算', D: '财务核算独立。', E: '财务未独立核算。'
     },
     {
          C: '执行会计制度', D: '执行《民间非营利组织会计制度》。', E: '未执行《民间非营利组织会计制度》。'
     },
     {
          C: '机构设置情况', D: '机构设置合理。', E: '未经审批设立地域性分支代表机构。'
     },
     {
          C: '党建工作情况',
          D: '党组织健全，成立了XXX党组织，并按规定多次开展党建活动。\r\n' +
               '或：未达到建立党组织的条件，尚未建立党组织。\r\n' +
               '已将党的建设、社会主义核心价值观写入章程。',
          E: '专职人员中正式党员x名，符合成立党支部条件，但未按《中国共产党章程》及时成立党支部，需加强党的组织建设。\r\n' +
               '或：已建立党组织，2019年未开展任何活动。\r\n' +
               '或：未将坚持中国共产党的全面领导、党建工作要求、社会主义核心价值观等相关要求写入《章程》，在贯彻落实党的路线方针政策方面还有差距。',
     },
     {
          B: '财务情况',
          C: '净资产',
          D: '2019年末净资产高于注册资金。',
          E: '年末净资产低于注册资金\r\n年末净资产低于3万，为X元，但年度内有开展活动。\r\n或：年末净资产低于3万，为X元，且年度内没有开展活动。'

     },
     {
          A: '监测评价内容',
          B: '现职国家机关工作人员兼任社会团体职务情况',
          D: '无现职国家机关工作人员兼任社会团体职务情况。\r\n或：经审批，有现职国家机关工作人员在社会团体任职，为XX（列出具体名单），并未领取报酬。',
          E: '未经审批，有现职国家机关工作人员在社会团体任职，为XX,（列出具体名单），有/未领取报酬。'

     },
     {
          B: '党政机关、国有企事业单位离退休领导干部兼任社会团体职务情况',
          D: '无党政机关、国有企事业单位离退休领导干部兼任社会团体职务情况。\r\n' +
               '或：经审批，有党政机关、国有企事业单位离退休领导干部在社会团体任职，为XX（列出具体名单），并未领取报酬',
          E: '未经审批，有党政机关、国有企事业单位离退休领导干部在社会团体任职，为XX,（列出具体名单），有/未领取报酬。'

     },
     {
          B: '业务活动情况',
          C: '本年度业务活动总体情况和下年度工作计划',
          D: '按照章程规定，2019年度内有开展活动。',
          E: '2019年未开展或较少开展业务活动。\r\n或：2019年开展活动超出章程范围，如XX（列出具体情况）。'

     },
     {
          C: '会费',
          D: '按章程规定，不收取会费/制定或修改会费标准，经会员大会通过，标准设置符合规范。',
          E: '未按章程规定制定或修改会费标准。\r\n' +
               '或：未填写有关制定或修改会费标准的信息。\r\n' +
               '或：会费标准的通过不符合规范，审议通过会费标准的会员大会中，会员出席率达不到三分之二。\r\n' +
               '或：审议通过会费标准的会员大会中，赞同人数没有超过出席会员的二分之一。\r\n' +
               '或：会费标准超过4档，不符合规范要求。'

     },
     {
          C: '行政机关委托授权的事项',
          D: '经正式批准具有行政机关委托事项X项，包括XX（列出具体事项内容）。\r\n或：没有行政机关委托授权的事项。',
          E: '未经批准，有行政机关委托事项（列出具体事项内容）。'

     },
     {
          C: '展览会、博览会、交易会',
          D: '经批准，举办展览会、博览会、交易会X项，包括XX（列出具体展览会、博览会、交易会3项左右）。\r\n或：没有举办展览会、博览会、交易会。',
          E: '未经批准，举办展览会、博览会、交易会（列出具体展览会、博览会、交易会项目）。'

     },
     {
          C: '研讨会、论坛活动',
          D: '经批准/内部程序，举办研讨会、论坛活动X项，包括XX（列出具体展览会、博览会、交易会3项左右）。\r\n或：没有举办研讨会、论坛活动。',
          E: '未经批准，举办研讨会、论坛活动（列出具体研讨会、论坛活动）。'

     },
     {
          C: '赛事、文艺评奖活动',
          D: '经X批准，举办赛事、文艺评奖活动X项，包括XX（列出具体赛事、文艺评奖3项左右）。\r\n或：没有举办赛事、文艺评奖活动。',
          E: '未经批准，举办赛事、文艺评奖活动（列出具体赛事、文艺评奖项目）。'

     },
     {
          C: '评比达标表彰活动',
          D: '经批准（批准单位/文号），开展评比表彰活动X项，包括XX（列出具体表彰活动3项左右）。\r\n或：没有开展评比表彰活动。',
          E: '未经批准，开展评比表彰活动（列出具体表彰活动项目）。'

     },
     {
          C: '培训、职称评审、认证、鉴定等活动',
          D: '经批准/内部程度，举办举办培训、职称评审、认证、鉴定等活动X项，包括XX。（列出具体3项左右）\r\n或：没有举办培训、职称评审、认证、鉴定等活动。',
          E: '未经批准，举办举办培训、职称评审、认证、鉴定等活动（列出具体举办培训、职称评审、认证、鉴定等项目）。'

     },
     {
          B: '涉外活动情况',
          C: '基本信息',
          D: '外籍人员在本单位工作、本年度参加国际会议、本年度出国（境）情况、举办外文网站、举办外文刊物情况。\r\n' +
               '或：未有对外工作情况。\r\n' +
               '存在X人为港澳台及外籍人员在本单位工作。\r\n' +
               '或：主办/承办国际会议X次。\r\n' +
               '或：组织或者参与出访团组X个，共计X人次出访。\r\n' +
               '或：举办外文网站X个；举办外文刊物X个。\r\n' +
               '（如无）2019年没有涉外基本情况。',
          E: '存在异常，体现在X（具体情形描述如未经批准，本年度参加国际会议。）。'

     },
     {
          C: '在境外设立机构',
          D: '在境外（国家名称）设立X机构，工作对象和内容为X。\r\n（如无）没有境外设立机构情况。',
          E: '在境外设立X机构，可能存在异常，工作对象和内容为X。'

     },
     {
          C: '对外交流合作项目',
          D: '开展对外交流项目X个，为（项目名称）。\r\n（如无）没有对外交流项目。',
          E: '存在异常，体现在X（具体情形描述）。'

     },
     {
          C: '参加国际组织',
          D: '参加国际组织（名称），担任X职务。\r\n（如无）没有参加国际组织情况。',
          E: '存在异常，体现在X（具体情形描述）。'

     },
     {
          B: '接受监督管理情况',
          C: '年度检查/年度报告',
          D: '连续3年年检合格。\r\n或：连续2年年检合格。\r\n或：2018年年检合格。\r\n或：尚未成立。',
          E: '曾于X年年检结论为基本合格。\r\n' +
               '或：曾于X年年检结论为不合格。\r\n' +
               '或：XX年未参加年检。\r\n' +
               '或：存在未按规范整改的情况（列出具体情况）\r\n' +
               '或：存在未按规范整改的情况，并未完成整改。'

     },
     { C: '行政处罚', D: '未接受过行政处罚。', E: '接受行政处罚（列出具体情况）。' },
     {
          A: '监测评价内容',
          C: '业务主管单位初审意见',
          D: '业务主管单位初审意见为正常。\r\n或：该社会团体没有业务主管单位。',
          E: '业务主管单位初审意见为,XX（列出具体存在问题的初审意见）。\r\n或：业务主管单位没有出具初审意见。'

     },
     {
          B: '收费情况自查自纠表',
          C: '会费',
          D: '依据章程规定的业务范围合理制定会费，不存在会费层次过多、会费票据使用不规范、强制入会并以此为目的收取会费或违规整改等情况。/不收取会费。',
          E: '存在未按章程规定的业务范围制定会费/会费层次过多/会费票据使用不规范/强制入会并以此为目的收取会费/违规整改情况（列出具体情况）。'

     },
     {
          C: '服务性收费',
          D: '不存在强制会员接受服务并收取费用、利用政府名义或政府委托事项为由擅自设立收费项目、违规整改等情况。',
          E: '存在强制会员接受服务并收取费用/利用政府名义或政府委托事项为由擅自设立收费项目/违规整改情况（列出具体情况）。'

     },
     {
          C: '经营服务性收费',
          D: '不存在超出章程范围的经营服务性收费项目。\r\n或：按章程规定，举办了X项经营服务性收费，经营服务性收费总额为X元，包括XX。（列举具体情况）',
          E: '存在超出章程范围的经营服务性收费项目。（列出具体情况）'

     },
     {
          C: '评比达标表彰收费',
          D: '不存在强制会员参加评比达标表彰活动、违规整改等情况。',
          E: '存在强制会员参加评比达标表彰活动/违规整改情况（列出具体情况）。'

     },
     {
          C: '接受捐赠',
          D: '不存在强制会员捐赠、违规整改等情况。\r\n或：捐赠均捐签订赠合同，且捐赠票据使用合规。',
          E: '存在强制会员捐赠/捐赠没有签订捐赠合同/捐赠票据使用不合规/违规整改情况（列出具体情况）。'

     },
     {
          C: '行政事业性收费',
          D: '不存在利用政府名义或政府委托事项为由擅自设立收费项目、提高收费标准，违规整改等情况。',
          E: '存在利用政府名义或政府委托事项为由擅自设立收费项目、提高收费标准/违规整改情况（列出具体情况）。'

     },
     { C: '其他收费', D: '不存在强制收费、违规整改情况。', E: '存在强制收费/违规整改情况（列出具体情况）。' },
     {
          C: '社会团体采取的规范收费、减轻企业负担涉及金额和规范情况',
          D: '不存在纠正违规行为。',
          E: '存在纠正违规行为，涉及金额X元（列出具体情况）。'

     },
     { A: '主要问题', B: '（汇总提炼上述“存在问题”）', name: ['A'], value: ['B'] },
     { A: '主要亮点', B: '（汇总提炼上述“相对规范”）', name: ['A'], value: ['B'] },
     { A: '专家签名', B: "test", name: ['A'], value: ['B'] },
     {
          A: '监测评价机构盖章：                  法人签名：                  经办人签名：                        联系电话：'
          , name: ['签名'], value: ['A']
     }
]



export let setVal = (val) => {
     return _.isUndefined(val) ? "" : val
}

export function readDirExcels(pathName, res) {

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
                    console.log(keys);
                    let target = extractColumn(keys);

                    targetArr.push(target);
               });
          }
          // console.log(targetArr);

          var xls = json2xls(targetArr);

          fs.writeFileSync('data.xlsx', xls, 'binary');
          res.send(targetArr);
     })
}


export let extractColumn = (result) => {
     console.log(result);
     let target = {};
     let prefix = '';
     for (let i in columnTemplate) {
          console.log("index: " + i);
          let tmp = columnTemplate[i];
          //contain name: [] , value: []
          if (tmp.name) {
               // arr is not empty
               if (!_.isEmpty(tmp.name)) {
                    for (let j in tmp.name) {
                         let fieldKey = result[i][tmp.name[j]] ? result[i][tmp.name[j]] : tmp.name[j];

                         target[fieldKey] = result[i][tmp.value[j]];
                    }
               }
          }

          // if TEMPLATE JSON contains D E
          if (tmp.D && _.isUndefined(tmp.name)) {
               // B column is not empty
               if (tmp.B) {
                    prefix = tmp['B'];
               }
               // PREFIX + result[i][C] + commonName['D']
               let firstColumnName = prefix + "-" + tmp['C'] + "-" + commonName['D'];
               let secondColumnName = prefix + "-" + tmp['C'] + "-" + commonName['E'];
               target[firstColumnName] = setVal(result[i]['D']);
               target[secondColumnName] = setVal(result[i]['E']);
          }
     }
     console.log(target);
     return target;
}