// Returns formatted date and time
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  const date = new Date(dateString)
  const formattedDate = date.toLocaleDateString("en-US", options)

  const hour = date.getHours()
  const minutes = date.getMinutes()
  const period = hour >= 12 ? "PM" : "AM"
  const formattedTime = `${hour % 12}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`

  return `${formattedDate} | ${formattedTime}`
}

// const inputDate = "2023-10-05T14:30:00Z"; // This represents October 5, 2023, at 2:30 PM UTC
// const output = formatDate(inputDate);
// console.log(output);