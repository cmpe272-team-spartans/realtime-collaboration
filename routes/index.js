
/*
 * GET home page.
 */

exports.index = function(req, res){
      console.log("*****************************************");
      console.log(req.session);
      console.log("*****************************************");

  res.render('index', { title: 'Express' });
};