import * as express from 'express'
const router = express.Router()


router.use((req, res, next) => {
  console.log(`路由执行成功啦~~~`, Date.now());
  next()
})



module.exports = router