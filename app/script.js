document.getElementById("numbers-solve").onclick = function(event){
    event.preventDefault();
    solve_numbers();
};

function solve_numbers() {
    let target = parseInt(document.getElementById('target').value, 10);
    let numbers = [];
    for (let i=1;i<=6;i++){
        let input = document.getElementById('n'+i).value;
        if (input === ''){
            continue;
        }

        let n = parseInt(document.getElementById('n'+i).value, 10);
        numbers.push(n);
        if (!isNaN(n)){
            document.getElementById('n'+i).value = n;   // Round decimal in UI
        }
    }
    
    console.log(target);
    console.log(numbers.join(' '));

    let solution_panel = document.getElementsByClassName('solution-steps')[0];
    if (numbers.some((elem) => elem<=0 || isNaN(elem))){
        solution_panel.innerHTML = 'Invalid numbers';
    } else if (numbers.length < 2){
        solution_panel.innerHTML = 'Please enter at least 2 numbers';
    } else if (isNaN(target) || target < 0){
        solution_panel.innerHTML = 'Invalid target';
    } else {
        /* Call solve function */

        // Dummy solutions
        solution_panel.innerHTML = `${target} = ${numbers.join('+')}`
    }
}