import fs from "fs";
import path from "path";

const event = fs.readFileSync(path.resolve(__dirname, "event.jsx"), {
  encoding: "utf-8",
});

export default {
  event,
};
