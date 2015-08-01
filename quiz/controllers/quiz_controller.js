var models = require('../models/models.js');

/*exports.question = function(req, res){

	models.Quiz.findAll().success(function(quiz){
		res.render('quizes/question', {pregunta:quiz[0].pregunta})
	});
	//res.render('quizes/question', {pregunta:'Capital de Italia'});
};*/

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){

	models.Quiz.find(quizId).then(

		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error){
		next(error);
	});
};
// GET /quizes
exports.index = function(req, res){
	if (req.query.search) {
		var search = req.query.search;
		search = search.replace('/ /g', '%');
		search = '%' + search + '%';
		models.Quiz.findAll({ where: ["pregunta like ?", search], order: 'pregunta ASC' }).then(function(quizes) {
			res.render ('quizes/index.ejs', {quizes:quizes, errors:[]});
		}).catch(function(error) { next(error); });
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render ('quizes/index.ejs', {quizes:quizes, errors:[]});
		}).catch(function(error) { next(error); });
	}
	/*models.Quiz.findAll().then(
		function(quizes){
			//res.render('quizes/index.ejs', {quizes: quizes});
			res.render('quizes/index', {quizes: quizes});
		}
	).catch(function(error){next(error);});*/
};


exports.destroy = function(req, res){

	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});

};

exports.new = function(req, res){
	//crea objeto quiz
	var quiz = models.Quiz.build(
		{pregunta:"Pregunta", respuesta:"Respuesta"}
	);
	res.render('quizes/new',{quiz:quiz, errors:[]});
};


exports.create = function(req, res) {
 
  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz:quiz, errors:[]});
}

// PUT /quizes/:id
exports.update = function(req, res){
	
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz:req.quiz, errors:err.errors});
			}
			else{

				req.quiz
				.save({fields:["pregunta","respuesta"]})
				.then(function(){res.redirect('/quizes');});
			}
		}
	);
};

// GET /quizes/:id
exports.show = function(req, res){
	
	res.render('quizes/show', {quiz:req.quiz, errors:[]});
	//models.Quiz.find(req.params.quizId).then(function(quiz){
	//	res.render('quizes/show', {quiz:quiz});
	//});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){

	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz:req.quiz, respuesta:resultado, errors:[]});
	/*models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer', {quiz:quiz, respuesta: 'Correcto'});
		}
		else{
			res.render('quizes/answer', {quiz:quiz, respuesta: 'Incorrecto'});
		}		
	});*/
	/*models.Quiz.findAll().success(function(quiz){
		if(req.query.respuesta === quiz[0].respuesta){
				//if(req.query.respuesta === 'Roma'){
			res.render('quizes/answer', {respuesta: 'Correcto'});
		}
		else{
			res.render('quizes/answer', {respuesta:'Incorrecto'});
		}
	});*/
	
};
