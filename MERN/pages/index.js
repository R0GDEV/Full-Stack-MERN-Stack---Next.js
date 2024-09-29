import { useState, useEffect, useRef } from 'react';

// Utility function to capitalize the first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const Home = () => {
  const [categories, setCategories] = useState([]); // Array to hold category names
  const [selectedCategory, setSelectedCategory] = useState(''); // Currently selected category
  const [products, setProducts] = useState([]); // Array to hold products
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // State to track if more products are available
  const [skip, setSkip] = useState(0); // Pagination skip (for API)
  const PRODUCTS_PER_BATCH = 9; // Products to fetch in each batch

  const observerRef = useRef(null); // Ref to observe the last product card

  // Fetch categories when the component mounts
  useEffect(() => {
    fetch('https://dummyjson.com/products/category-list') // Fetch categories once
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.map(capitalize)); // Capitalize all category names
        handleCategoryChange(''); // Fetch the first batch of all products
      });
  }, []);

  // Fetch products based on the selected category and skip value
  const fetchProducts = (category = '', skip = 0) => {
    setLoading(true); // Set loading to true when fetching
    const url = category
      ? `https://dummyjson.com/products/category/${category}?limit=${PRODUCTS_PER_BATCH}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${PRODUCTS_PER_BATCH}&skip=${skip}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.products.length < PRODUCTS_PER_BATCH) {
          setHasMore(false); // No more products to load
        }
        setProducts((prevProducts) => [...prevProducts, ...data.products]); // Append new products to the list
        setLoading(false); // Stop loading after fetching
      });
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setProducts([]); // Clear the previous products when a new category is selected
    setSkip(0); // Reset skip to 0
    setHasMore(true); // Reset hasMore for the new category
    fetchProducts(category, 0); // Fetch first batch of products for the selected category
  };

  // Set up the intersection observer for infinite scrolling
  useEffect(() => {
    if (loading || !hasMore) return; // If currently loading or no more products, don't trigger infinite scroll

    if (observerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setSkip((prevSkip) => prevSkip + PRODUCTS_PER_BATCH); // Increase skip value when reaching the bottom
          }
        },
        { threshold: 1 }
      );
      observer.observe(observerRef.current);
      return () => observer.disconnect();
    }
  }, [loading, hasMore]);

  // Fetch more products when skip changes
  useEffect(() => {
    if (skip > 0) {
      fetchProducts(selectedCategory, skip);
    }
  }, [skip]);

  return (
    <div className="max-w-full mx-auto py-10 flex">
      {/* Category Selection */}
      <div className="w-64 h-screen sticky top-0 bg-gray-50 p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6">Categories</h2>
        <ul className="flex flex-col gap-4">
          <li
            className={`cursor-pointer py-2 px-4 transition-all duration-300 ease-in-out rounded-lg ${
              !selectedCategory ? 'font-bold text-blue-600 bg-blue-100 shadow-lg' : 'hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryChange('')}
          >
            All Categories
          </li>
          {categories.map((category, index) => (
            <li
              key={index}
              className={`cursor-pointer py-2 px-4 transition-all duration-300 ease-in-out rounded-lg ${
                selectedCategory === category ? 'font-bold text-blue-600 bg-blue-100 shadow-lg' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Products Display */}
      <div className="flex-1 p-6">
      <h1 className="text-4xl  h-10	 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-center mb-10 animate-pulse ">
  Discover Amazing Products by Category
</h1>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"  style={{
    backgroundColor: '#f3f4f6', // Light gray background to blend with the image
    backgroundBlendMode: 'multiply', // Blends the image and background
  }}>
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={index}
                className="group card cursor-pointer border border-gray-200 hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg overflow-hidden"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{
     
      backgroundColor: '#f3f4f6', // Match the image background color
    }}
                  className="w-full h-48 object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="p-4 bg-white flex flex-col justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-all duration-300 ease-in-out">
                    {product.title}
                  </h2>
                  <p className="text-gray-600 text-sm truncate">{product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-800 font-medium">Price: ${product.price}</span>
                    <button className="btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No products available for this category.</p>
          )}
        </div>

        {/* Loading More */}
        {loading && <p className="text-center mt-6">Loading more products...</p>}

        {/* Invisible div to trigger infinite scroll */}
        <div ref={observerRef} className="h-1"></div>
      </div>
    </div>
  );
};

export default Home;
