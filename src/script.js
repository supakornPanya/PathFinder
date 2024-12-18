let grid = new Array(100).fill().map(() => new Array(100).fill(0));
let rows = 0;
let cols = 0;
let validNode = 0;

//(1)nav function----------------------------------------------->
const navButtons = document.querySelectorAll(".nav-btn");
const sectionTarget = document.querySelectorAll(".section");
//alway check button class name "nav-btn" have click?
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    //Set all button to default & hidden all section
    navButtons.forEach((btn) => {
      btn.classList.remove(
        "bg-orange-200",
        "text-orange-600",
        "border-orange-700",
        "hover:bg-orange-400",
        "hover:text-white"
      );
      btn.classList.add("hover:bg-gray-200", "text-black");
    });
    sectionTarget.forEach((section) => section.classList.add("hidden"));
    //Activate target button & show target section
    button.classList.add(
      "bg-orange-200",
      "text-orange-600",
      "border-orange-700",
      "hover:bg-orange-400",
      "hover:text-white"
    );
    let IdActivateSection = button.getAttribute("data-target");
    document.getElementById(IdActivateSection).classList.remove("hidden");
  });
});
//(1)nav function----------------------------------------------->

//(2)create table input & toggle colors----------------------------------------------->
//(2.1) crete submitButton or warning?
const ButtonOutTable = document.getElementById("ButtonOutTable");
const warning = document.getElementById("warning");

ButtonInTable.addEventListener("click", () => {
  rows = document.getElementById("rows").value;
  cols = document.getElementById("cols").value;
  if (rows > 0 && cols > 0) {
    ButtonOutTable.classList.remove("hidden");
    warning.classList.add("hidden");
    console.log("add button addEventListener");
  } else {
    ButtonOutTable.classList.add("hidden");
    warning.classList.remove("hidden");
    console.log("add warning addEventListener");
  }
});

//(2.2)create table input
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); //prevent web reload when click submit
  rows = document.getElementById("rows").value;
  cols = document.getElementById("cols").value;
  validNode = rows * cols;

  //rows&cols != 0 => create input table
  if (rows != 0 && cols != 0) {
    console.log("Create Table input => rows : ", rows, ", colums : ", cols);
    //clear inTable(clear before table)
    let inputTable = document.getElementById("ContainerInput");
    inputTable.innerHTML = "";
    //create table in html
    let table = document.createElement("table");
    table.classList.add("InTable");
    for (let i = 0; i < rows; i++) {
      let TableRow = document.createElement("tr");
      TableRow.classList.add("InTableRow");
      for (let j = 0; j < cols; j++) {
        grid[i][j] = 1;
        let nodeButton = document.createElement("button");
        nodeButton.classList.add("NodeButton");
        nodeButton.style.backgroundColor = "rgb(150,255,150)";
        nodeButton.innerText = i + 1 + "," + (j + 1);
        nodeButton.onclick = function () {
          toggleColor(nodeButton, i, j);
        };

        let tableData = document.createElement("td");
        tableData.classList.add("InTableData");

        tableData.appendChild(nodeButton);
        TableRow.appendChild(tableData);
      }

      table.appendChild(TableRow);
    }
    //add table(new) Container of input Table
    inputTable.appendChild(table);
  }
});

//(2.3) function toggle colors
function toggleColor(thisButton, i, j) {
  if (getComputedStyle(thisButton).backgroundColor == "rgb(150, 255, 150)") {
    grid[i][j] = -1;
    validNode--;
    thisButton.style.backgroundColor = "rgb(255, 90, 90)";
  } else {
    grid[i][j] = 1;
    validNode++;
    thisButton.style.backgroundColor = "rgb(150, 255, 150)";
  }
  console.log(
    "ToggleColor => i :",
    i + 1,
    ", j :",
    j + 1,
    ", to Colors : ",
    getComputedStyle(thisButton).backgroundColor
  );
}
//(2)create table input & toggle colors----------------------------------------------->

//(3)show result & calculate(DFS Graph)----------------------------------------------->
let canFindPath = false;
//(3.1)show the result
function showResult(path) {
  let output = document.getElementById("ContainerOutput");
  output.innerHTML = "";

  //can find the answer--->
  if (path.length == validNode) {
    //mark step in graph
    let ans = Array.from({ length: rows }, () => Array(cols).fill());
    for (let i = 0; i < path.length; i++) {
      console.log("now => i :", path[i][0], " , j:", path[i][1]);
      let x = path[i][0];
      let y = path[i][1];
      ans[x][y] = i + 1;
    }

    //create table answer
    let outTable = document.createElement("table");
    outTable.classList.add("OutTable");
    for (let i = 0; i < rows; i++) {
      let TableRow = document.createElement("tr");
      TableRow.classList.add("OutTableRow");

      for (let j = 0; j < cols; j++) {
        let TableData = document.createElement("td");
        TableData.classList.add("OutTableData");

        let answerData = document.createElement("div");
        if (ans[i][j] == undefined) {
          answerData.classList.add("InvalidNode");
          answerData.innerText = "⛔";
        } else {
          answerData.classList.add("ValidNode");
          answerData.innerText = ans[i][j];
        }

        TableData.appendChild(answerData);
        TableRow.appendChild(TableData);
      }
      outTable.appendChild(TableRow);
    }

    let output = document.getElementById("ContainerOutput");
    output.appendChild(outTable);
  }
  //can't find the answer--->
  else {
    let alert = document.createElement("div");
    alert.classList.add("alert");
    alert.innerText =
      "From this input graph, unable to find a route (cannot traverse all valid nodes).";
    output.appendChild(alert);
  }
}

//(3.2)traversal in graph (start = (i,j)) by DFS(backtracking)
function isValid(i, j, flag) {
  return (
    i >= 0 && i < rows && j >= 0 && j < cols && grid[i][j] === 1 && !flag[i][j]
  );
}
function isNextTo(last, now) {
  return Math.abs(last[0] - now[0]) <= 1 && Math.abs(last[1] - now[1]) <= 1;
}

function dfs(i, j) {
  let path = []; //path of the answer
  path.push([i, j]);

  let visited = Array.from({ length: rows }, () => Array(cols).fill(false)); //mark visited node
  visited[i][j] = true;

  let stack = []; //stack for DFS
  stack.push([i, j]);

  //direction for move
  let dir = [
    [0, 1], // Right
    [1, 0], // Down
    [-1, 0], // Up
    [0, -1], // Left
  ];

  //DFS
  while (stack.length > 0) {
    let now = stack[stack.length - 1];
    stack.pop();
    let foundNext = false; //

    //find next node
    for (let k = 0; k < dir.length; k++) {
      let nexti = now[0] + dir[k][0];
      let nextj = now[1] + dir[k][1];
      if (isValid(nexti, nextj, visited)) {
        if (isNextTo(path[path.length - 1], [nexti, nextj])) {
          path.push([nexti, nextj]);
          visited[nexti][nextj] = true;
          stack.push([nexti, nextj]);
          foundNext = true;
          break;
        }
      }
    }

    //(func backtrack)not have a node to go next -> backtrack to parent node
    if (!foundNext && stack.length > 0) {
      path.push(stack[stack.length - 1]);
    }
  }

  return path;
}

//(3.3)try to start all node
function startTraversal() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] == 1) {
        let path = dfs(i, j);
        if (path.length == validNode) return path;
      }
    }
  }
  return [];
}

//(3.4)submit -> (DFS + show result)
function submitGraph() {
  canFindPath = false;
  let ans = startTraversal();
  showResult(ans);
}
//(3)show result & calculate(DFS Graph)----------------------------------------------->
