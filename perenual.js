var root = document.getElementById("root");
var tbl = $("#tbl");
var thead = $("#thead");
var tbody = $("#tbody");
//added inputEl and submitEl
let inputEl = $(".textarea");
let submitEl = $(".submit");
let hardEl = $(".hard");
let doorEl = $(".door");
let sunEl = $(".sun");
let waterEl = $(".water");
let cycleEl = $(".cycle");
let edibleEl = $(".edible");
storage = [];
nstorage = [];
var APIBaseGetSpeciesUrl = "https://perenual.com/api/species-list?";
// var APIKey = "sk-qIm964bf0f7b09f5f1663"; // Abby's API Key
// var APIKey = "sk-z8cO64b9d312351e61631"; // Bill's API Key
let APIKey = "sk-kQ2L64bf0eaf742d61662"; // Michael's API Key

APIBaseGetSpeciesUrl += "key=" + APIKey;
//added click listener
submitEl.on("click", function () {
  //clear out table
  let bodyEl = $("#tbody");
  bodyEl.empty();
  // Use APIBaseURL before concatenating search parameters
  if (inputEl.val() !== null) {
    APIBaseGetSpeciesUrl += "&q=" + inputEl.val();
  }
  //Zone Options - 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
  if (hardEl[0].innerText !== "Hardiness Zone") {
    APIBaseGetSpeciesUrl += "&hardiness=" + hardEl[0].innerText;
  }
  //optional, boolean, default is NULL
  if (doorEl[0].innerText !== "Indoor/Outdoor") {
    if (edibleEl[0].innerText == "Indoor") {
      APIBaseGetSpeciesUrl += "&indoor=" + "1";
    } else if (edibleEl[0].innerText == "Outdoor") {
      APIBaseGetSpeciesUrl += "&indoor=" + "0";
    }
  }
  //Options - full_shade, part_shade, sun-part_shade, full_sun
  if (sunEl[0].innerText !== "Sunlight") {
    APIBaseGetSpeciesUrl += "&sunlight=" + sunEl[0].innerText;
  }
  //Options - frequent, average, minimum
  if (waterEl[0].innerText !== "Water") {
    APIBaseGetSpeciesUrl += "&watering=" + waterEl[0].innerText;
  }
  //Options - perennial, annual, biennial, biannual
  if (cycleEl[0].innerText !== "Life cycle") {
    APIBaseGetSpeciesUrl += "&cycle=" + cycleEl[0].innerText;
  }
  //optional, boolean, default is NULL
  if (edibleEl[0].innerText !== "Edible") {
    if (edibleEl[0].innerText == "Yes") {
      APIBaseGetSpeciesUrl += "&edible=" + "1";
    } else if (edibleEl[0].innerText == "No") {
      APIBaseGetSpeciesUrl += "&edible=" + "0";
    }
  }

  getSpecies_paginated_fetch();
});

// Function returns ALL items that match the criteria from the user.
function getSpecies_paginated_fetch(url = APIBaseGetSpeciesUrl, page = 1) {
  return fetch(`${url}&page=${page}`) // Append the page number to the base URL
    .then((response) => response.json())
    .then((newResponse) => {
      // This is where we'll write to the webpage

      for (let i = 0; newResponse.data.length > i; i++) {
        // paginate results
        if (
          newResponse.data[i].watering !==
          "Upgrade Plans To Premium/Supreme - https://perenual.com/subscription-api-pricing. I'm sorry"
        ) {
          try {
            // The first field we're appending is a thumbnail image if it is available
            if (newResponse.data[i].default_image["thumbnail"] == null) {
              tblVal = "<tr><td>" + "Image Unavailable" + "</td>";
            } else {
              tblVal =
                "<tr><td>" +
                '<a> <img src="' +
                newResponse.data[i].default_image["thumbnail"] +
                '" border=1></a>' +
                "</td>";
            }
            tblVal =
              tblVal +
              "<td>" +
              newResponse.data[i].scientific_name +
              "</td><td>" +
              newResponse.data[i].common_name +
              "</td><td>" +
              newResponse.data[i].other_name +
              "</td><td>" +
              newResponse.data[i].watering +
              "</td><td>" +
              newResponse.data[i].sunlight +
              "</td><td>" +
              newResponse.data[i].cycle +
              "</td><td><button class='savebutton' id='" +
              newResponse.data[i].id +
              "' name='" +
              newResponse.data[i].common_name +
              "'>save</button></tr>";
          } catch (error) {
            console.log(error);
          }

          try {
            tbody.append(tblVal);
          } catch (error) {
            console.log(error);
          }
        }
        tbl.append(tbody);

        //click listener for save buttons
        $("#" + newResponse.data[i].id).on("click", function () {
          savedItem = $(this);
          if (storage !== null) {
            storage.push(savedItem.attr("id"));
            nstorage.push(savedItem.attr("name"));
            localStorage.setItem("storedId", JSON.stringify(storage));
            localStorage.setItem("storedName", JSON.stringify(nstorage));
            // console.log(JSON.parse(localStorage.getItem("storedId")));
          } else {
            storage = [savedItem.attr("id")];
            nstorage = [savedItem.attr("name")];
            localStorage.setItem("storedId", JSON.stringify(storage));
            localStorage.setItem("storedName", JSON.stringify(nstorage));
          }
          render();
        });
      }

      // todo: remove governor on pages when
      // done testing. remove last && page < ???
      if (page <= newResponse.last_page && page < 4) {
        page++;
        // Making a recursive call to append results from all pages
        return getSpecies_paginated_fetch(url, page);
      }
    });
}

// const getSpeciesResponse = getSpecies_paginated_fetch();
// getSpecies_Test()// const getSpeciesResponse = getSpecies_Test2();

//render function puts IDs in "my plants"
function render() {
  if (JSON.parse(localStorage.getItem("storedId")) !== null) {
    storage = JSON.parse(localStorage.getItem("storedId"));
    nstorage = JSON.parse(localStorage.getItem("storedName"));
    for (let i = 0; i < storage.length; i++) {
      let favEl = $("<p>");
      let linkEl = $("<a>");
      linkEl.attr("id", "plant" + i);
      linkEl.attr("data-id", i);
      linkEl.attr("name", storage[i]);
      // linkEl.attr('onclick','getPlantbyid_fetch()')
      $(".card-content").append(favEl);
      favEl.append(linkEl);

      if (nstorage !== null && nstorage.length > 0) {
        $("#plant" + i).text(JSON.parse(localStorage.getItem("storedName"))[i]);
      }

      linkEl.on("click", function () {
        let plantId = $(this).attr("name");
        return fetch(
          `https://perenual.com/api/species/details/${plantId}?key=${APIKey}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            tbody.empty();
            var tblVal = "";
            try {
              // The first field we're appending is a thumbnail image if it is available
              if (data.default_image["thumbnail"] == null) {
                tblVal = "<tr><td>" + "Image Unavailable" + "</td>";
              } else {
                tblVal =
                  "<tr><td>" +
                  '<a> <img src="' +
                  data.default_image["thumbnail"] +
                  '" border=1></a>' +
                  "</td>";
              }

              tblVal = tblVal +
                "<td>" + data.scientific_name +
                "</td><td>" +
                data.common_name +
                "</td><td>" +
                data.other_name +
                "</td><td>" +
                data.watering +
                "</td><td>" +
                data.sunlight +
                "</td><td>" +
                data.cycle +
                "</td><td><button class='savebutton clearbutton' id='" + data.id + "' name='" +
                data.common_name + "'>clear</button></tr>";
            } catch (error) {
              console.log(error);
            }

            try {
              tbody.append(tblVal);
            } catch (error) {
              console.log(error);
            }
            //  tbody.append(
            //    "<tr><td>" +
            //      data.scientific_name +
            //      "</td><td>" +
            //      data.common_name +
            //      "</td><td>" +
            //      data.other_name +
            //      "</td><td>" +
            //      data.watering +
            //      "</td><td>" +
            //      data.sunlight +
            //      "</td><td>" +
            //      data.cycle +
            //      "</td><td><button class='savebutton clearbutton' id='" +
            //      data.id +
            //      "'>clear</button></tr>"
            //  );
            //  tbl.append(tbody);
            //  console.log(data);
            let clearEl = $(".clearbutton");
            //clear click listener
            clearEl.on("click", function () {
              let clear = $(this);
              //find the array index that matches the plant's id
              indexclear = storage.findIndex(getindex);
              function getindex(x) {
                console.log(clearEl.attr("id"));
                return x == clearEl.attr("id");
              }
              storage.splice(indexclear, 1);
              nstorage.splice(indexclear, 1);
              localStorage.setItem("storedId", JSON.stringify(storage));
              localStorage.setItem("storedName", JSON.stringify(nstorage));
              $("#plant" + i).remove();
              $(this).parent().siblings().remove();
              $(this).parent().remove();
              $(this).remove();
            });
          });
      });
    }
  } else {
    storage = [];
    nstorage = [];
  }
}
//call render function on page load
render();



