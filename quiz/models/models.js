var path = require('path');

// Postgres DATABASE_URL  = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);


// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Quiz
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Usar BBDD SQLite
//var sequelize = new Sequelize(null, null, null, {dialect:"sqlite", storage:"quiz.sqlite"});

// Importar la definicion de la tabla Quiz en quiz.js
//var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // exportar definicion de la tabla Quiz
exports.Comment = Comment;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	
	// then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		
		// la tabla se inicializa solo si está vacia
		if(count === 0){

			Quiz.create({pregunta:'Capital de Italia',
				respuesta:'Roma', categoria:'Humanidades'});
			Quiz.create({pregunta:'Capital de Portugal',
				respuesta:'Lisboa', categoria:'Humanidades'}).then(function(){
					console.log('La base de datos de virus ha sido actualizada');
				});
		}
		
	});
});
/*sequelize.sync().success(function(){
	
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){

		if(count === 0){ // la tabla se inicializa solo si esta vacia

			Quiz.create({pregunta:'Capital de Italia', respuesta:'Roma'}).success(function(){
				console.log('La base de datos de virus ha sido actualizada');
			});

		}

	});
});*/