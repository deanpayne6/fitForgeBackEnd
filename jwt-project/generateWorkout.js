//Arrays of workouts for testing generate workout
testBicep = ["Dumbbell Curl", "Reverse Dumbbell Curl", "Dumbbell Hammer Curl", "Zottman Bicep Curl", "Concentration Bicep Curl", 
            "Dumbbell Incline Biceps Curl", "Dumbbell  Wall BicepsCurl", "Step Back BicepsCurl", "Dumbbell Pinwheel BicepsCurl", 
            "Offset BicepsCurl", "Biceps 21s"];
testTricep = ["Neutral Grip Dumbbell Bench Press", "JM Dumbbell Bench Press", "Dumbbell Skull Crushers", "Dumbbell Tate Presses", 
            "Overhead Dumbbell Extensions", "Dumbbell Kickbacks", "Dumbbell-Loaded Triceps Dips"];
testChest = ["Becnh Press", "incline Bench Press", "Decline Bench Press", "Chest Fly", "Dumbbell Reverse Chest Press"];
testBack = ["Dumbbell Row", "Incline Row", "Elevated Plank Row", "Dumbbell Pullover", "Incline Pause Row", "Bent Over Row",
            "Upright Row", "Farmers Carry"];
testShoulder = ["Dumbbell shoulder press", "Dumbbell front raise", "Dumbbell side lateral raise", "Dumbbell bent-over raise", 
                "Dumbbell upright row", "Dumbbell shoulder shrugs", "One arm dumbbell swing", "Spellcaster", "Seesaw Press"];
testAbs = ["Sit-Ups", "Crunch", "Heel Taps", "Plank Hold", "Leg Raises", "Bicycle Crunch", "Pike Crunch", "Reverse Crunch", "Hollow Holds"];
testLegs = ["Dumbbell Split Squat", "Dumbbell Romanian Deadlift", "Dumbbell Single Leg RDL", "Dumbbell Goblet Squat", 
            "Dumbbell Side Lunge", "Dumbbell Reverse Lunge", "Dumbbell Front Squat", "Dumbbell Elevated Split Squat", 
            "Dumbbell Forward Lunge", "Weighted Step Up", "Dumbbell Jump Squat"];

allWorkouts = [testBicep, testTricep, testChest, testBack, testShoulder, testAbs, testLegs];
muscleGroup = ["Bicep", "Tricep", "Chest", "Back", "Shoulder", "Abs", "Legs"];
//Psuedo Menu for workout selection

const prompt = require('prompt-sync')({sigint: true});
console.log('1. Bicep\n2. Tricep\n3. Chest\n4. Back\n5. Shoulder\n6. Abs\n7. Legs');
let menu1 = prompt('Please select option 1: ');
menu1 = Number(menu1);
let menu2 = prompt('Please select option 2: ');
menu2 = Number(menu2);
let menu3 = prompt('Please select option 3: ');
menu3 = Number(menu3);

console.log("The muscle groups you chose are: " + muscleGroup[menu1-1] + ", " + muscleGroup[menu2-1] + ", and " + muscleGroup[menu3-1])
console.log("Here is your workout for the day: ")

//First Test, assuming long workout and three muscle groups chosen
muscleArray = [allWorkouts[menu1-1], allWorkouts[menu2-1], allWorkouts[menu3-1]]
workoutList = []
count = 0
for(let i = 0; i < 8; i++){
    if(count == 3)
        count = 0
    singleGroup = muscleArray[count]
    randomWorkout = Math.floor(Math.random() * singleGroup.length);
    workoutList.push(singleGroup[randomWorkout])
    muscleArray[count].splice(randomWorkout, 1)
    count++
}
console.log(workoutList)