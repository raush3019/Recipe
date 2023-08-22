const closeSearchBoxBtn = document.querySelector(".navBar .closeSearchBox");
const openSearchBoxBtn = document.querySelector(".navBar .openSearchBox");
const searchBox = document.querySelector(".navBar > .searchBar");
const form = document.querySelector("form");

const imagesDiv = document.querySelector(".xScroll > .imgesDiv");
const imgDiv = document.querySelector(".xScroll > .imgDiv");
const checkingBtn = document.querySelector(".ri-menu-line");

const heartBtn = document.querySelector(".recipeDet > .foot > i");

const recipeOfDay = document.querySelector(".recipeOfDay");
const recipeDetClose = document.querySelector(".recipeDetails .ri-close-line");
const recipeDetails = document.querySelector(".recipeDetails");

openSearchBoxBtn.addEventListener("click", function () {
  searchBox.style.display = "initial";
});

closeSearchBoxBtn.addEventListener("click", function () {
  searchBox.style.display = "none";
});
recipeDetClose.addEventListener("click", function () {
  recipeDetails.style.display = "none";
});

const favImgList = [];
const SearchImgList = [];

// I want to display favImgList list in fav meals section
const renderFavImgList = (data) => {
  imagesDiv.innerHTML = "";
  favImgList.forEach((index, ele) => {
    let childDiv = document.createElement("div");
    let childDivImg = document.createElement("img");
    let childDivIcon = document.createElement("i");
    let childDivH4 = document.createElement("h4");
    childDiv.className = "imgDiv";
    childDivIcon.className = "ri-close-line disable";

    childDivH4.textContent = index.imgName;
    childDivImg.src = index.imgUrl;

    childDiv.appendChild(childDivIcon);
    childDiv.appendChild(childDivImg);
    childDiv.appendChild(childDivH4);

    childDivIcon.addEventListener("click", function (event) {
      // console.log(childDivImg.src);
      rmvFromFavMeals(favImgList, "imgUrl", childDivImg.src);
      console.log(favImgList);
      renderFavImgList(data);
      // renderSearchList();
    });
    childDivImg.addEventListener("click", function (event) {
      recipeDetails.style.display = "flex";
      recipeDetails.querySelector("img").src = childDivImg.src;
      recipeDetails.querySelector("p").textContent = index.Instruct;
    });
    imagesDiv.appendChild(childDiv);
  });
};

const renderSearchList = (data) => {
  recipeOfDay.innerHTML = "";
  data.forEach((index, ele) => {
    // console.log(index);
    let childDiv = document.createElement("div");
    let childDivImgDiv = document.createElement("div");
    let childDivFootDiv = document.createElement("div");
    let childDivImgDivImg = document.createElement("img");
    let childDivIcon = document.createElement("i");
    let childDivFootH3 = document.createElement("h3");

    childDiv.className = "recipeDet";
    childDivImgDiv.className = "imgDiv";
    childDivFootDiv.className = "foot";
    childDivIcon.className = "ri-heart-line";

    childDivFootH3.textContent = index.strMeal;
    childDivImgDivImg.src = index.strMealThumb;

    childDiv.appendChild(childDivImgDiv);
    childDiv.appendChild(childDivFootDiv);
    childDivImgDiv.appendChild(childDivImgDivImg);
    childDivFootDiv.appendChild(childDivFootH3);
    childDivFootDiv.appendChild(childDivIcon);

    const chkIfImgExist = favImgList.findIndex((item) => {
      item.imgUrl === index.strMealThumb;
      console.log(item);
    });
    childDivIcon.addEventListener("click", function (event) {
      const favDet = {
        imgName: index.strMeal,
        imgUrl: childDivImgDivImg.src,
        Instruct: index.strInstructions,
      };
      if (chkIfImgExist === -1) {
        console.log(chkIfImgExist);
        favImgList.push(favDet);
      }
      renderFavImgList();
    });
    childDivImgDiv.addEventListener("click", function (event) {
      recipeDetails.style.display = "flex";
      recipeDetails.querySelector("img").src = childDivImgDivImg.src;
      recipeDetails.querySelector("p").textContent = index.strInstructions;
    });

    if (chkIfImgExist !== -1) {
      childDivIcon.className = "ri-heart-fill";
      childDivIcon.style.color = "red";
    } else {
      childDivIcon.className = "ri-heart-line";
      childDivIcon.style.color = "black";
    }

    recipeOfDay.appendChild(childDiv);
  });
};

// renderSearchList();

const rmvFromFavMeals = (favImgList, property, value) => {
  const index = favImgList.findIndex((item) => item[property] === value);

  if (index !== -1) {
    favImgList.splice(index, 1); // Remove the object at the found index
  }
};

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const SearchKeyWord = event.target.searchItem.value;
  apiData(SearchKeyWord);
  searchBox.style.display = "none";
  event.target.searchItem.value = "";
});

const apiData = async (SearchKeyWord) => {
  let apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${SearchKeyWord}`;
  await fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // recipeOfDay.querySelector("h2").style.display = "none";
      renderSearchList(data.meals);
      renderFavImgList(data.meals);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  console.log(apiUrl);
};
apiData("");
