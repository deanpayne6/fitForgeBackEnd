var mysql = require('mysql');

const workoutSchema = mysql.Schema({
    workout: {type: String, default:null},
    muscle_group: { type: String, default: null },
    sets: { type: int, default: null },
    reps: { type: int,  default: null},
    rest: { type: int, default: null},
    target: {type: int, default: null}

});

 module.exports = mysql.model("workout", workoutSchema);

