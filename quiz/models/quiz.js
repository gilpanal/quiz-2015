module.exports = function(sequelize, DataTypes){

	//return sequelize.define('Quiz', {pregunta:DataTypes.STRING, respuesta: DataTypes.STRING});
	return sequelize.define('Quiz', {
			
			pregunta:{
				type:DataTypes.STRING,
				validate:{notEmpty:{msg:"-> Falta pregunta"}}
			}, 
			respuesta: {
				type:DataTypes.STRING,
				validate:{notEmpty:{msg:"-> Falta respuesta"}}
			}, 
			categoria: {
				type:DataTypes.STRING				
			}

		}
	);
}