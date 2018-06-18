const cheerio = require("cheerio")
const fs =      require("fs")

const html = fs.readFileSync("source.html", "utf8")
const $ = cheerio.load(html)
const table = $("#ContentPlaceHolder1_GridView1")
const tableColumnNames = `
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
const students = table.find("tr").map(function() {
  const columns = $(this).find("td")
  const student = {}

  columns.each(function(index) {
    if (index == 1) return
    const fieldName = tableColumnNames[index]

    student[fieldName] = $(this).text().trim()
  })
  return student
}).get()

// console.log(students)
// make our work easier
const COMMA_TO_DOT = /,/,"."

// now let's sort some data
const studentsBy = students.sort(function (a, b) {
  const balA_ekz = Number(a.bal_ekz.replace(COMMA_TO_DOT))
  const balA_diploma = Number(a.bal_diploma.replace(COMMA_TO_DOT))
  const balA = balA_ekz + balA_diploma

  const balB_ekz = Number(b.bal_ekz.replace(COMMA_TO_DOT))
  const balB_diploma = Number(b.bal_diploma.replace(COMMA_TO_DOT))
  const balB = balB_ekz + balB_diploma

  return balB - balA
})

console.log(studentsBy)
fs.writeFileSync("students-sorted.json", JSON.stringify(studentsBy))
