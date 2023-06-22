const routes = require('express').Router();
const controller=require('../controller/controller');


// creating routes

routes.route('/api/categories')
    .post(controller.create_Categories)
    .get(controller.get_Category)
    

// export server using module

routes.route('/api/transactions')
   .post(controller.create_Transaction)
   .get(controller.get_Transaction)
   
routes.route('/api/labels')
   .get(controller.get_Labels)

module.exports=routes;
 