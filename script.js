const inputSlider = document.querySelector("[data-length-slider]")
const lengthDisplay = document.querySelector("[data-length-number]")
 
const passwordDisplay = document.querySelector("[dataPasswordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~`!@#$%^&*()_-=+{[}]\|'\";:?/.>,<";

let password = ""; 
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle grey
setIndicator("#ccc")
//set password length

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength; 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `1px 0px 12px 1px ${color}`;
}  

function getRandInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandInteger(65,91));
}

function generateSymbol(){
    const randNum = getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum||hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper) && (hasNum||hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copied span visible
    copyMsg.classList.add('active');

    setTimeout( ()=>{
        copyMsg.classList.remove('active');
    },2000);
    
}

function shufflePassword(array ){
    // Fisher yates Method
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j]; 
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

// console.log(generateBtn);

generateBtn.addEventListener("click",() => {
    // if no checkbox is selected
    // console.log("clicked");
    if(checkCount==0) return;

    if(passwordLength<checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // starting to find new pass

        // remove old password
    password = "";


    // lets put the stuff mentione din checkbox
    // if(uppercaseCheck.checked)
    //  password += generateUppercase();
    // if(lowercaseCheck.checked)
    //  password += generateLowercase();
    // if(symbolsCheck.checked)
    //  password += generateSymbol();
    // if(numbersCheck.checked)
    //  password += generateRandomNumber();

    let funcArr = [];

    console.log(uppercaseCheck);
    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    // console.log("Compulsory addition done");
    // remaining addition

    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRandInteger(0,funcArr.length-1);
        password += funcArr[randIndex]();
    }
    // console.log("remaining addition done");

    // shuufle the password

    password = shufflePassword(Array.from(password));

    // console.log("Shuffling Done");

    // show in display input
    passwordDisplay.value = password;
    // console.log("Display Done");

    // calculate strength
    calcStrength();
})