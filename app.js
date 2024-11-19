async function fetchCities(query) {
  try {
    // Endpunkt mit dem Parameter "term" anstatt "query"
    const response = await fetch(`https://6rlt9htd51.execute-api.us-east-1.amazonaws.com/autocomplete?term=${query}`);
    const data = await response.json();
    return data; // Die Lambda-Funktion gibt bereits ein Array zurÃ¼ck, daher kannst du es direkt verwenden
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}

function autocomplete(input) {
  let currentFocus;

  input.addEventListener("input", async function () {
    let listContainer, matchingItem, val = this.value;

    // Close any already open lists of suggestions
    closeAllLists();

    if (!val) {
      return false;
    }
    currentFocus = -1;

    // Fetch cities from the Lambda function via API Gateway
    const cities = await fetchCities(val);

    // Create a DIV element that will contain the suggestions
    listContainer = document.createElement("DIV");
    listContainer.setAttribute("id", this.id + "-autocomplete-list");
    listContainer.setAttribute("class", "autocomplete-items");

    this.parentNode.appendChild(listContainer);

    // Loop through the fetched cities and match items
    for (let i = 0; i < cities.length; i++) {
      matchingItem = document.createElement("DIV");

      // Make the matching letters bold
      matchingItem.innerHTML = "<strong>" + cities[i].substr(0, val.length) + "</strong>";
      matchingItem.innerHTML += cities[i].substr(val.length);

      // Insert a hidden input field to store the current value
      matchingItem.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";

      // When someone clicks on the suggestion
      matchingItem.addEventListener("click", function () {
        input.value = this.getElementsByTagName("input")[0].value;
        closeAllLists();
      });

      listContainer.appendChild(matchingItem);
    }
  });

  // Keyboard navigation
  input.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "-autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      // Down arrow
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      // Up arrow
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      // Enter key
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    const items = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < items.length; i++) {
      if (elmnt != items[i] && elmnt != input) {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

// Initialize autocomplete on the search input
autocomplete(document.getElementById("search-bar"));