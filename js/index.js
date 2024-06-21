$(function(){

  var productShownNumber = 9;
  $(".product-listing .product-box").slice(0, productShownNumber).show();
  $(document).on('click','.show-more-btn',function(e){
    productShownNumber += 9;
    e.preventDefault();
    $(".product-listing .product-box").slice(0, productShownNumber).show();
    if($('.product-listing .product-box:last-child').is(":visible")){
      $('.show-more-btn').addClass('disable');
    }
  });

  if ($(window).width() < 768){
      $('header .hamberger-btn').click(function(){
          $('body').toggleClass('contentoverflow')
          $('header nav').toggleClass('visible');
          $('header').toggleClass('menuoverlay');
          return false;
      });

      $('header .cart-btn').click(function(){
          $('body').toggleClass('contentoverflow')
          $('.filter-sec').toggleClass('visible');
          $('header').toggleClass('menuoverlay');
          return false;
      });

      $(document).on("click", function(event){
        var $trigger = $('header .hamberger-btn, header nav, header .cart-btn, .filter-sec');
        if($trigger !== event.target && !$trigger.has(event.target).length){
            $('header').removeClass('menuoverlay');
            $('header nav').removeClass('visible');
            $('body').removeClass('contentoverflow');
            $('.filter-sec').removeClass('visible');
        }
      });
  }

});

// add javascript api, filter, serch and other related 
document.addEventListener("DOMContentLoaded", function() {
  let products = [];
  let currentIndex = 0;
  const productsPerPage = 10;
  let selectedCategories = [];
  let sortOrder = '';
  let searchQuery = '';

  function renderProducts(startIndex) {
    const productListing = document.getElementById("product-listing");
    productListing.innerHTML = '';
    let filteredProducts = products;

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
    }

    // Sort the products based on sortOrder
    if (sortOrder === 'low-to-high') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-to-low') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    const endIndex = startIndex + productsPerPage;
    const itemsToShow = filteredProducts.slice(startIndex, endIndex);

    itemsToShow.forEach(product => {
      const productBox = document.createElement("div");
      productBox.className = "product-box";
      productBox.setAttribute("role", "listitem");
      productBox.innerHTML = `
        <div class="image-box">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <h3 class="name"><a href="#">${product.title}</a></h3>
        <span class="price">$${product.price}</span>
        <button class="likedislike" aria-label="Save ${product.title}"></button>
        <div class="likedislike"><img src="images/save.png" alt="save"></div>
      `;
      productListing.appendChild(productBox);
    });

    currentIndex = startIndex + itemsToShow.length;
    updateResultsCount(filteredProducts.length);

    if (currentIndex >= filteredProducts.length) {
      document.getElementById("load-more").style.display = "none";
    } else {
      document.getElementById("load-more").style.display = "inline-block";
    }
  }

  function updateSelectedCategories() {
    const checkboxes = document.querySelectorAll('.filter-type input[type="checkbox"]');
    selectedCategories = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);
    currentIndex = 0;
    renderProducts(currentIndex);
  }

  function updateSortOrder() {
    sortOrder = document.querySelector('.sortby').value;
    currentIndex = 0;
    renderProducts(currentIndex);
  }

  function updateSearchQuery() {
    searchQuery = document.getElementById('product-search').value;
    currentIndex = 0;
    renderProducts(currentIndex);
  }

  function updateResultsCount(count) {
    document.querySelector('.result').innerText = `${count} Results`;
  }

  function displayError(message) {
    const productListing = document.getElementById("product-listing");
    productListing.innerHTML = `<div class="error-message">${message}</div>`;
  }

  function fetchProducts() {
    fetch("https://fakestoreapi.com/products")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        products = data;
        renderProducts(0);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        displayError("Failed to load products. Please try again later.");
      });
  }

  document.getElementById("load-more").addEventListener("click", function() {
    renderProducts(currentIndex);
  });

  document.querySelectorAll('.filter-type input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateSelectedCategories);
  });

  document.querySelector('.sortby').addEventListener('change', updateSortOrder);

  document.getElementById('product-search').addEventListener('input', updateSearchQuery);

  fetchProducts();
});
