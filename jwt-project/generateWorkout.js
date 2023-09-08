//Arrays of workouts for testing generate workout
//Once Database is set up, the sql queries will go here, will grab all 7 muscle groups and put them into a list like shown below
testBicep = ["Dumbbell Curl", "Reverse Dumbbell Curl", "Dumbbell Hammer Curl", "Zottman Bicep Curl", "Concentration Bicep Curl", 
            "Dumbbell Incline Biceps Curl", "Dumbbell Wall BicepsCurl", "Step Back BicepsCurl", "Dumbbell Pinwheel BicepsCurl", 
            "Offset BicepsCurl", "Biceps 21s"]
testTricep = ["Neutral Grip Dumbbell Bench Press", "JM Dumbbell Bench Press", "Dumbbell Skull Crushers", "Dumbbell Tate Presses", 
            "Overhead Dumbbell Extensions", "Dumbbell Kickbacks", "Dumbbell-Loaded Triceps Dips"]
testChest = ["Becnh Press", "incline Bench Press", "Decline Bench Press", "Chest Fly", "Dumbbell Reverse Chest Press"]
testBack = ["Dumbbell Row", "Incline Row", "Elevated Plank Row", "Dumbbell Pullover", "Incline Pause Row", "Bent Over Row",
            "Upright Row", "Farmers Carry"]
testShoulder = ["Dumbbell shoulder press", "Dumbbell front raise", "Dumbbell side lateral raise", "Dumbbell bent-over raise", 
                "Dumbbell upright row", "Dumbbell shoulder shrugs", "One arm dumbbell swing", "Spellcaster", "Seesaw Press"]
testAbs = ["Sit-Ups", "Crunch", "Heel Taps", "Plank Hold", "Leg Raises", "Bicycle Crunch", "Pike Crunch", "Reverse Crunch", "Hollow Holds"]
testLegs = ["Dumbbell Split Squat", "Dumbbell Romanian Deadlift", "Dumbbell Single Leg RDL", "Dumbbell Goblet Squat", 
            "Dumbbell Side Lunge", "Dumbbell Reverse Lunge", "Dumbbell Front Squat", "Dumbbell Elevated Split Squat", 
            "Dumbbell Forward Lunge", "Weighted Step Up", "Dumbbell Jump Squat"]

//allWorkouts and muscleGroup array will stay, the rest will not be needed once front end is done
allWorkouts = [testBicep, testTricep, testChest, testBack, testShoulder, testAbs, testLegs]
muscleGroup = [" Bicep", " Tricep", " Chest", " Back", " Shoulder", " Abs", " Legs"]
lengthList = ["Short", "Medium", "Long"]
muscleArray = []
chosenGroups = []

//Test Menu for workout selection
//Front end will take care of this, once it is ready, will replace this with the app.post/get calls (idk which one)
//which will recieve the data on which muscle groups were chosen, how many were chosen, and the chosen length of the workout
const prompt = require('prompt-sync')({sigint: true})
console.log('1. Short (3-4 Workouts)\n2. Medium (4-6 Workouts)\n3. Long (8-6 Workouts)')
workoutLength = prompt("Please Select a Workout Length Option: ")
workoutLength = Number(workoutLength)
console.log("You Have Chosen a " + lengthList[workoutLength-1] + " Workout")

menuOption = 0
count = 0
console.log('\n1. Bicep\n2. Tricep\n3. Chest\n4. Back\n5. Shoulder\n6. Abs\n7. Legs\n8. Stop Selecting Muscle Groups')
if(workoutLength != 1){
    console.log("You May Select up to 3 Muscle Groups")
    while(menuOption != 8){
        menuOption = prompt('Please Select a Muscle Group: ')
        menuOption = Number(menuOption)
        if (menuOption != 8){
            muscleArray.push(allWorkouts[menuOption-1])
            chosenGroups.push(muscleGroup[menuOption-1])
        }
        count++
        if(count == 3)
            menuOption = 8
    }
}

else{
    console.log("You May Select up to 2 Muscle Groups")
    while(menuOption != 8){
        menuOption = prompt('Please Select a Muscle Group: ')
        menuOption = Number(menuOption)
        if (menuOption != 8){
            muscleArray.push(allWorkouts[menuOption-1])
            chosenGroups.push(muscleGroup[menuOption-1])
        }
        count++
        if(count == 2)
            menuOption = 8
    }
}

workoutList = []
count = 0
console.log("The muscle groups you chose are:" + chosenGroups)

//Start of Logic for Generate Workout, everything above will change, everything below should stay the same
//Short Workout Length, 1 Workout Chosen
if((workoutLength == 1) && (muscleArray.length == 1)){
    for(let i = 0; i < 3; i++){
        if(count == muscleArray.length)
            count = 0
        singleGroup = muscleArray[count]
        randomWorkout = Math.floor(Math.random() * singleGroup.length)
        workoutList.push(singleGroup[randomWorkout])
        muscleArray[count].splice(randomWorkout, 1)
        count++
    }
}

//Short Workout Length, 2-3 Workouts Chosen
//Medium Workout Length, 1 Workout Chosen
else if(((workoutLength == 1) && (muscleArray.length >= 2)) || ((workoutLength == 2) && (muscleArray.length == 1))){
    for(let i = 0; i < 4; i++){
        if(count == muscleArray.length)
            count = 0
        singleGroup = muscleArray[count]
        randomWorkout = Math.floor(Math.random() * singleGroup.length)
        workoutList.push(singleGroup[randomWorkout])
        muscleArray[count].splice(randomWorkout, 1)
        count++
    }
}

//Medium Workout Length, 2-3 Workouts Chosen
//Long Workout Length, 1 Workout Chosen
else if(((workoutLength == 2) && (muscleArray.length >= 2)) || ((workoutLength == 3) && (muscleArray.length == 1))){
    for(let i = 0; i < 6; i++){
        if(count == muscleArray.length)
            count = 0
        singleGroup = muscleArray[count]
        randomWorkout = Math.floor(Math.random() * singleGroup.length)
        workoutList.push(singleGroup[randomWorkout])
        muscleArray[count].splice(randomWorkout, 1)
        count++
    }
}

//Long Workout Length, 2-3 Workouts Chosen
else if((workoutLength == 3) && (muscleArray.length >= 2)){
    for(let i = 0; i < 8; i++){
        if(count == muscleArray.length)
            count = 0
        singleGroup = muscleArray[count]
        randomWorkout = Math.floor(Math.random() * singleGroup.length)
        workoutList.push(singleGroup[randomWorkout])
        muscleArray[count].splice(randomWorkout, 1)
        count++
    }
}

console.log("Here is your workout for the day: ")
console.log(workoutList)
console.log("Thank You For Using FitForge!")
