const express = require("express");
const cors = require("cors");

const { Pool } = require("pg");

const app = express();
const port = 5005;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  const speed = parseFloat(req.query.speed);
  const angle = parseFloat(req.query.angle) * (Math.PI / 180);
  const interval = parseFloat(req.query.interval);
  console.log(req.query)
  const g = 9.81;

  if (!speed || !angle || !interval) {
    res
      .status(400)
      .send(
        "Please provide valid query parameters: speed, angle, and interval."
      );
    return;
  }

  let t = 0.0;
  const dataPoints = [];

  while (true) {
    const x = speed * t * Math.cos(angle);
    const y = speed * t * Math.sin(angle) - 0.5 * g * t * t;

    if (y >= 0) {
      dataPoints.push({ time: t, x: x, y: y });
    }

    const next_t = t + interval;
    const next_y = speed * next_t * Math.sin(angle) - 0.5 * g * next_t * next_t;

    if (next_y < 0) {
      const t_hit_ground = (2 * speed * Math.sin(angle)) / g;

      const final_x = speed * t_hit_ground * Math.cos(angle);

      dataPoints.push({ time: t_hit_ground, x: final_x, y: 25 });
      break;
    }

    t += interval;
  }

  res.json(dataPoints);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
