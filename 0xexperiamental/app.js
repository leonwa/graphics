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
    const Q = new Vector2D(points[1][0], points[1][1]);
    const R = new Vector2D(points[2][0], points[2][1]);
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
  let Rq = R.copy();
  Rq.sub(Q).normalize();
  let Pq = P.copy().sub(Q).normalize();
  let Xq = new Vector2D(1, 0);

  console.log("sin Rq", Xq.cross(Rq));
  console.log("sin Pq", Xq.cross(Pq));
  console.log("sin P R", Pq.cross(Rq));
}
