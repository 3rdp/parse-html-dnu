const cheerio = require("cheerio")
const fs =      require("fs")

let html = fs.readFileSync("source.html", "utf8")
let $ = cheerio.load(html)
let table = $("#ContentPlaceHolder1_GridView1")
let tableColumnNames = `
num
0
name
bal
bal_ekz
bal_diploma
orig
`.trim().split("\n")

// delete tableHead
table.find("tr:first-child").remove()

// loop through rows
let students = table.find("tr").map(function() {
  let columns = $(this).find("td")
  let student = {}

  columns.each(function(index) {
    if (index == 1) return
    let fieldName = tableColumnNames[index]

    student[fieldName] = $(this).text().trim()
  })
  return student
}).get()

// console.log(students)
// make our work easier

// now let's sort some data
var studentsBy = students.sort(function (a, b) {
  let balA_ekz = Number(a.bal_ekz.replace(/,/,"."))
  let balA_diploma = Number(a.bal_diploma.replace(/,/,"."))
  let balA = balA_ekz + balA_diploma

  let balB_ekz = Number(b.bal_ekz.replace(/,/,"."))
  let balB_diploma = Number(b.bal_diploma.replace(/,/,"."))
  let balB = balB_ekz + balB_diploma

  return balB-balA
})

console.log(studentsBy)
fs.writeFileSync("students-sorted.json", JSON.stringify(studentsBy))
