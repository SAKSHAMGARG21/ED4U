export const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// const today = new Date(); 
// const formattedToday = formattedDate(today);
// console.log(formattedToday); // Output: e.g., "January 15, 2023" 

// const dateString = "2023-02-10"; 
// const formattedDate = formattedDate(dateString); 
// console.log(formattedDate); // Output: e.g., "February 10, 2023" 