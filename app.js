const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// 1. Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.value = currCode;
    newOption.innerText = currCode;

    // Default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    }
    if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// 2. Update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// 3. Fetch and update exchange rate
const updateExchangeRate = async () => {
  const amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const base = fromCurr.value;
  const target = toCurr.value;

  const url = `https://open.er-api.com/v6/latest/${base}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.rates || !data.rates[target]) {
      msg.innerText = "Exchange rate not available.";
      return;
    }

    const rate = data.rates[target];
    const finalAmount = (rate * amtVal).toFixed(2);

    msg.innerText = `${amtVal} ${base} = ${finalAmount} ${target}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error("API Error:", error);
  }
};

// 4. Event Listeners
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
