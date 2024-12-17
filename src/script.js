let grid = new Array(100).fill().map(() => new Array(100).fill(0));
let rows = 0;
let cols = 0;
let validNode = 0;

//(1)create table input & toggle colors----------------------------------------------->
//(1.1)create table input
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); //prevent web reload when click submit
  rows = document.getElementById("rows").value;
  cols = document.getElementById("cols").value;
  validNode = rows * cols;
  console.log("Create Table input => rows : ", rows, ", colums : ", cols);

  //clear inTable(clear before table)
  let inputTable = document.getElementById("ContainerInput");
  inputTable.innerHTML = "";
  //create table in html
  let table = document.createElement("table");
  table.classList.add("InTable");
  for (let i = 0; i < rows; i++) {
    let TableRow = document.createElement("tr");
    TableRow.classList.add("InTableRow")
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

  let submitTable = document.createElement("button");
  submitTable.innerText = "submit";
  submitTable.onclick = function () {
    submitGraph();
  };
  inputTable.appendChild(submitTable);
});

//(1.2) function toggle colors
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
//(1)create table input & toggle colors----------------------------------------------->

//test
function swapColor1(event) {
  let thisButton = event.target;
  if (getComputedStyle(thisButton).backgroundColor == "rgb(0, 128, 0)") {
    console.log("change to red");
    thisButton.style.backgroundColor = "red";
  } else {
    console.log("change to green");
    thisButton.style.backgroundColor = "green";
  }
  console.log("now color ", getComputedStyle(thisButton).backgroundColor);
}

//(2)show result & calculate(DFS Graph)----------------------------------------------->
let canFindPath = false;
//(2.1)show the result
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
    alert.innerText = "Unable to find route";
    output.appendChild(alert);
  }
}

//(2.2)traversal in graph (start = (i,j)) by DFS(backtracking)
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

//(2.3)try to start all node
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

//(2.4)submit -> (DFS + show result)
function submitGraph() {
  canFindPath = false;
  let ans = startTraversal();
  showResult(ans);
}
//(2)show result & calculate(DFS Graph)----------------------------------------------->
