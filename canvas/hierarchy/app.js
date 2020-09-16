const dataSource = "https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json";

/* globals d3 */
(async function () {
  const data = await (await fetch(dataSource)).json();
  const regions = d3
    .hierarchy(data)
    .sum((d) => 1)
    .sort((a, b) => b.value - a.value);

  const pack = d3.pack().size([1600, 1600]).padding(3);

  const root = pack(regions);

  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  const TAU = 2 * Math.PI;

  function draw(
    ctx,
    node,
    { fillStyle = "rgba(0, 0, 0, 0.2)", textColor = "white" } = {}
  ) {
    const children = node.children;
    const { x, y, r } = node;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    if (children) {
      for (let i = 0; i < children.length; i++) {
        draw(context, children[i]);
      }
    } else {
      const name = node.data.name;
      ctx.fillStyle = textColor;
      ctx.font = "1.5rem Arial";
      ctx.textAlign = "center";
      ctx.fillText(name, x, y);
    }
  }

  function getDistance(p1, p2) {
    const xdiff = p1[0] - p2[0];
    const ydiff = p1[1] - p2[1];
    const dist = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
    return dist;
  }
  function inShape(p, node) {
    const dist = getDistance(p, [node.x, node.y]);
    return dist <= node.r;
  }
  function getActiveShape(p, node) {
    const children = node.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        let cnode = getActiveShape(p, children[i]);
        if (cnode !== null) return cnode;
      }
    }
    if (inShape(p, node)) return node;
    return null;
  }
  function clear(ctx, node) {
    const { x, y, r } = node;
    ctx.fillStyle = "rgba(255, 255, 255)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  draw(context, root);

  let activeNode = null;
  canvas.addEventListener("mousemove", (event) => {
    var x = event.clientX * 2,
      y = event.clientY * 2,
      p = [x, y];

    let node = getActiveShape(p, root);
    if (node !== null) {
      if (activeNode != null) {
        clear(context, root);
        draw(context, root);
      }
      activeNode = node;
      activeNode = node;
      context.fillStyle = "rgba(0, 150, 94,0.2)";
      context.beginPath();
      context.arc(node.x, node.y, node.r, 0, TAU);
      context.fill();
    } else {
      if (activeNode !== null) {
        clear(context, root);
        draw(context, root);
      }
    }
  });
})();
