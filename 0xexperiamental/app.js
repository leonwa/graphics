import { Vector2D } from "../common/lib/vector2d.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const { width, height } = canvas;
ctx.translate(0, height);
ctx.scale(1, -1);

ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(0, height);
ctx.stroke();
ctx.moveTo(0, 0);
ctx.lineTo(width, 0);
ctx.stroke();
ctx.closePath();
let points = [];
let drawing = false;
let colors = ["red", "green", "blue"];
let pole = [0, 0];
canvas.addEventListener("click", (e) => {
  if (points.length < 3) {
    points.push([e.clientX, -1 * (e.clientY - height)]);
    drawPoint(points[points.length - 1], colors[points.length - 1]);
  } else if (!drawing) {
    drawing = true;
    const P = new Vector2D(points[0][0], points[0][1]);
    let Q, R;
    if (points[1][0] <= points[2][0]) {
      Q = new Vector2D(points[1][0], points[1][1]);
      R = new Vector2D(points[2][0], points[2][1]);
    } else {
      R = new Vector2D(points[1][0], points[1][1]);
      Q = new Vector2D(points[2][0], points[2][1]);
    }
    drawPoint([P.x, P.y], colors[0]);
    drawPoint([Q.x, Q.y], colors[1]);
    drawPoint([R.x, R.y], colors[2]);
    calcShape(P, Q, R);
  }
});
function drawPoint(point, color) {
  ctx.beginPath();
  ctx.arc(point[0], point[1], 6, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}
function calcShape(P, Q, R) {
  ctx.beginPath();
  ctx.moveTo(Q.x, Q.y);
  ctx.lineTo(R.x, R.y);

  ctx.stroke();
  ctx.closePath();
  let Rq = R.copy();
  Rq.sub(Q).normalize();

  let Xq = new Vector2D(1, 0);
  let Yq = new Vector2D(0, 1);

  let sinR = Xq.cross(Rq);
  let cosR = Math.sqrt(1 - Math.pow(sinR, 2));

  let rightOfRX = 512 - Q.x;
  let rightOfRY = (rightOfRX * sinR) / cosR;
  let rightOfR = new Vector2D(rightOfRX, rightOfRY);
  let leftOfQX = -Q.x;
  let leftOfQY = (leftOfQX * sinR) / cosR;
  let leftOfQ = new Vector2D(leftOfQX, leftOfQY);
  Rq = R.copy().sub(Q);
  ctx.translate(Q.x, Q.y);
  ctx.fillStyle = "#e8a8a8";
  ctx.beginPath();
  ctx.arc(leftOfQ.x, leftOfQ.y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rightOfR.x, rightOfR.y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = "#ffaba0";
  ctx.setLineDash([5, 15]);
  ctx.moveTo(Rq.x, Rq.y);
  ctx.lineTo(rightOfR.x, rightOfR.y);

  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(leftOfQ.x, leftOfQ.y);
  ctx.fillStyle = "#ffaba0";
  ctx.fill();
  ctx.stroke();
  let unitRq = R.copy().sub(Q).normalize();
  let unitPq = P.copy().sub(Q).normalize();
  let sinRP = unitRq.cross(unitPq);
  let cosRP = Math.sqrt(1 - Math.pow(sinRP, 2));
  let mod_PtoRQ = P.copy().sub(Q).mod * cosRP;
  let PtoRQ = new Vector2D(mod_PtoRQ * cosR, mod_PtoRQ * sinR);

  if (P.copy().sub(Q).sub(PtoRQ).mod > P.copy().sub(Q).mod) {
    console.log("发现钝角", P.copy().sub(PtoRQ).mod, P.copy().sub(Q).mod);
    PtoRQ.rotate(Math.PI);
  }
  ctx.beginPath();
  ctx.fillStyle = "#e3d3e3";
  ctx.setLineDash([]);
  ctx.arc(PtoRQ.x, PtoRQ.y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(P.copy().sub(Q).x, P.copy().sub(Q).y);
  ctx.lineTo(PtoRQ.x, PtoRQ.y);
  ctx.fill();
  ctx.stroke();

  let distanceToRQ = PtoRQ.copy().sub(P.copy().sub(Q)).mod;
  let ltoRQ = distanceToRQ;
  if (PtoRQ.x < 0) {
    ltoRQ = P.copy().sub(Q).mod;
    ctx.beginPath();
    ctx.moveTo(P.copy().sub(Q).x, P.copy().sub(Q).y);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
  }
  if (PtoRQ.x > R.copy().sub(Q).x) {
    ltoRQ = P.copy().sub(R).mod;
    ctx.beginPath();
    ctx.moveTo(P.copy().sub(Q).x, P.copy().sub(Q).y);
    ctx.lineTo(R.copy().sub(Q).x, R.copy().sub(Q).y);
    ctx.fill();
    ctx.stroke();
  }
  console.log("P到直线距离为", distanceToRQ);
  console.log("P到线段距离为", ltoRQ);
}
