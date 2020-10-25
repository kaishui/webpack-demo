# Set node env
```
https://nodejs.org/en/
```
# git clone 
```
git clone https://github.com/kaishui/webpack-demo.git
```

# cd $project

# npm i

# modify the excel dir on src/server.js
```
readDirExcels("/software/workspace/excelToJson", res);
```
Replace with your excel files dir
```
readDirExcels("$your_excel_path", res);
```

# npm run server

# access url
```
http://localhost:3000/readExcel
```
