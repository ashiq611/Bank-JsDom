/////////////////////////////////////////////////////////////
// Data
/////////////////////////////////////////////////////////////
const accounts = [
  {
    owner: "Shohanur Rahman",
    movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
    interestRate: 1.5, // %
    password: 1234,
    movementsDates: [  //iso
      "2022-11-18T21:31:17.178Z",
      "2022-12-23T07:42:02.383Z",
      "2023-01-28T09:15:04.904Z",
      "2023-04-01T10:17:24.185Z",
      "2023-07-08T14:11:59.604Z",
      "2023-09-10T17:01:17.194Z",
      "2023-09-12T23:36:17.929Z",
      "2023-09-15T12:51:31.398Z",
      "2023-09-19T06:41:26.190Z",
      "2023-09-21T08:11:36.678Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Sunerah Binte Ayesha",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850],
    interestRate: 1.3, // %
    password: 5678,
    movementsDates: [
      "2022-12-11T21:31:17.671Z",
      "2022-12-27T07:42:02.184Z",
      "2023-02-14T10:17:24.687Z",
      "2023-01-05T09:15:04.805Z",
      "2023-03-12T14:11:59.203Z",
      "2023-05-16T17:01:17.392Z",
      "2023-08-10T23:36:17.522Z",
      "2023-09-03T12:51:31.491Z",
      "2023-09-18T06:41:26.394Z",
      "2023-09-21T08:11:36.276Z",
    ],
    currency: "EUR",
    locale: "en-GB",
  },
];

/////////////////////////////////////////////////////////////
// Elements
/////////////////////////////////////////////////////////////
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const form = document.querySelector(".login");

const btnLogin = document.querySelector(".login-btn");
const btnLogout = document.querySelector(".logout");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");

const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPassword = document.querySelector(".login-input-password");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");


// starts the work with Bismillah

let currentAcc;
let timer;

function updateUI(currentAcc) {
  displayMovements(currentAcc);
  displaySumamry(currentAcc);
  displayBalance(currentAcc);
}


/////////////////////////////////////////////////////////////
// operation starts
////////////////////



// move day starts

function formatMoveDate(date, locale){
  const calculateDays = (date1, date2) => Math.round(Math.abs(date2-date1)/ (24*60*60*1000));

  const daysCount = calculateDays(new Date(), date);

  if (daysCount === 0) {
    return "Today";
  }else if (daysCount === 1){
    return "Yesterday";
  }else if (daysCount <= 7){
    return `${daysCount} days ago`
  }else{
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

}


// move day ends


// format currency starts


function formatCurrency(amount, locale, currency){
   const option = {
    style: 'currency',
    currency: currency,
   }

  return new Intl.NumberFormat(locale, option).format(amount);
}



// format currency ends


// create username starts

function createUsername(accounts){

  accounts.forEach(account => {
    account.username = account.owner.toLowerCase().split(" ").map(word => word.at(0)).join("")

    console.log(account.username, account.password)
  })

}

createUsername(accounts)




// create username ends


// login starts



btnLogin.addEventListener('click', (e) => {
  e.preventDefault();

  currentAcc = accounts.find((account) => inputLoginUsername.value === account.username);

  if(currentAcc?.password === Number(inputLoginPassword.value)){
    // welcome msg

    labelWelcome.textContent= `Welcome, ${currentAcc.owner.split(" ").at(0)}`


    // format Date 

    const loginDate = new Date();

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',

    }

    labelDate.textContent = new Intl.DateTimeFormat(currentAcc.locale, options).format(loginDate);

    // update ui

    containerApp.style.opacity = 1;
    

    if(timer){
      clearInterval(timer);
    }
    timer = timeout();

    updateUI(currentAcc);

    form.style.display = "none"


  }else{
    labelWelcome.textContent = 'Login Failed'

    // update ui

    containerApp.style.opacity = 0;
  }

  inputLoginUsername.value = "";
  inputLoginPassword.value = "";
  inputLoginUsername.blur();
  inputLoginPassword.blur();
  btnLogout.style.opacity = 1;



})


// login ends

// logout starts

btnLogout.addEventListener('click', () => {

  containerApp.style.opacity = 0;

  btnLogout.style.opacity = 0;

  if (timer) {
    clearInterval(timer);
  }
  

   labelWelcome.textContent = "Log in to get started";

  form.style.display = "flex";

})
// logout ends


// display Movements starts///////////

function displayMovements (account, sort = false){

  containerMovements.innerHTML= "";

  const moves = sort ? account.movements.slice(0).sort((a,b) => a - b) : account.movements;

  moves.forEach((move,i) => {

    const formatMove = formatCurrency(move, account.locale, account.currency);

    const date = new Date (account.movementsDates[i]);

    const displayDate = formatMoveDate(date, account.locale);

    const type = (move > 0) ? "deposit" : "withdrawal"
    const movementsHtml = `
     <div class="movements-row">
          <div class="movements-type movements-type-${type}">${i+1} ${type}</div>
          <div class="movements-date">${displayDate}</div>
          <div class="movements-value">${formatMove}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', movementsHtml);
    
  });

}




// display Movements ends/////////////////


// display summarry starts/////////////////

function displaySumamry(account){

  // income
  const income = account.movements.filter(move => move > 0).reduce((acc, deposit) => acc + deposit)

  labelSumIn.textContent= formatCurrency(income, account.locale, account.currency)

  // outcome
  const outcome = account.movements.filter(move => move < 0).reduce((acc,withdrawal) => acc + withdrawal)

  labelSumOut.textContent = formatCurrency(Math.abs(outcome),account.locale, account.currency)

  // interest
  const interest = account.movements.filter(move => move > 0).map(deposit => (deposit * account.interestRate) / 100 ).filter(interest => interest >= 1).reduce((acc,interest) => acc + interest)

  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );

}




// display summarry ends

// display balance starts


function displayBalance (account){

  account.balance = account.movements.reduce((acc,move) => acc + move)

  labelBalance.textContent = formatCurrency(account.balance, account.locale, account.currency);

}





// display balance ends

// transfer money starst

btnTransfer.addEventListener('click', (e) =>{
  e.preventDefault()

  const recieverAcc = accounts.find((acc)=> acc.username === inputTransferTo.value);

  const amount = Number(inputTransferAmount.value);


  if(amount > 0 && amount <= currentAcc.balance && recieverAcc.username !== currentAcc.username && recieverAcc){
    currentAcc.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // add current date

    currentAcc.movementsDates.push(new Date().toISOString());

    recieverAcc.movementsDates.push(new Date().toISOString());

    // timeout

    if (timer) {
      clearInterval(timer);
    }
    timer = timeout();



    // update ui

    updateUI(currentAcc);

    labelWelcome.textContent = "Transaction Success";
  }else{
    if (timer) {
      clearInterval(timer);
    }
    timer = timeout();
    labelWelcome.textContent = "Transaction Failed";
  }

  // update dorker notification?????????

  // clear input
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  inputTransferTo.blur();
  inputTransferAmount.blur();


})




// transfer money ends

// loan start

btnLoan.addEventListener('click', (e) => {
  e.preventDefault()

  const amount = Number(inputLoanAmount.value);
  const loanRules = currentAcc.movements.some((move) => move >= amount * 0.1)

  if (amount > 0 && loanRules) {
    // add money as deposit
    currentAcc.movements.push(amount);

    // add current date

    currentAcc.movementsDates.push(new Date().toISOString());

    // timeout

    if (timer) {
      clearInterval(timer);
    }
    timer = timeout();

    // update ui
    updateUI(currentAcc);

    // notification
    labelWelcome.textContent = "Loan Successfully";
  } else {
    if (timer) {
      clearInterval(timer);
    }
    timer = timeout();
    labelWelcome.textContent = "Loan Failed";
  }

  // clear input
  inputLoanAmount.value = "";
})


// loan ends


// delete acc starts


btnClose.addEventListener('click' , (e) => {
  e.preventDefault();

  if(currentAcc.username === inputCloseUsername.value && currentAcc.password === Number(inputClosePassword.value)){

    const targetIndex = accounts.findIndex((acc) => acc.username === currentAcc.username);


    // dlt
    accounts.splice(targetIndex, 1);

    // updateUI
    containerApp.style.opacity = 0;

    // notifitation
    labelWelcome.textContent = "Your Account Deleted";
    btnLogout.style.opacity = 0;
    form.style.display = "flex";
  }else{
    if (timer) {
      clearInterval(timer);
    }
    timer = timeout();
    labelWelcome.textContent = "Your Account Can Noot Be Deleted";
  }

  // clear input

  inputCloseUsername.value = "";
  inputClosePassword.value = "";
  inputCloseUsername.blur();
  inputClosePassword.blur();
})


// delete acc ends


// timer starts

function timeout() {
  labelTimer.textContent = "";

  let setTime = 600;

  const clock = () => {
    const min = String(Math.trunc(setTime/60)).padStart(2, 0);
    const sec = String(setTime % 60).padStart(2,0);

    labelTimer.textContent = `${min}:${sec}`;

    if(setTime === 0){
      clearInterval(timer);
      labelWelcome.textContent = "You are Inactive & have been logged out!";
      containerApp.style.opacity = 0;
      btnLogout.style.opacity = 0;
      form.style.display = "flex";
    }
    setTime--;
  }
  clock();

  timer = setInterval(clock, 1000);

  return timer;
}


// timer ends


// sort starts

let sorted = false;

btnSort.addEventListener('click' , () => {

  displayMovements(currentAcc, !sorted);
  sorted = !sorted;
})


// sort ends







