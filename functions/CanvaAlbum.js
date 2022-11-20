const Canvas = require("@napi-rs/canvas");
const jimp = require("jimp");
const { request } = require("undici");
const { shorten, Abrev } = require("./utils");

const _calculateProgress = (player, track, bar) => {
  const cx = player.position;
  const rx = track.info.length;

  if (rx <= 0) return 1;
  if (cx > rx) return parseInt(bar.width) || 0;

  let width = (cx * 615) / rx;
  if (width > bar.width) width = bar.width;
  return parseInt(width) || 0;
}
const  padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
}
const ConvertToMs = (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds
  )}`;
}

async function CanvaAlbum(track, player, bar) {
  const { body } = await request(
    track.info.image || "https://www.istockphoto.com/photos/anime-characters"
  );
  const avatar = await Canvas.loadImage(await body.arrayBuffer());
    const trackname = track.info.title;
    //canva image
    const canvas = Canvas.createCanvas(934, 282);
  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = 1;
  let background = await jimp.read("./bg.jpg");
  background.blur(1)
  background = await background.getBufferAsync("image/png");
   const bg = await Canvas.loadImage(
     background
   );
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  const name = shorten(trackname, 25);
  const author = shorten(track.info.author, 35);
    ctx.globalAlpha = 1;
    ctx.font = `bold 30px Arial Black`;
    ctx.textAlign = "start";
  ctx.fillStyle = "#fff";
  ctx.fillText(name, 257 + 20, 110);
  ctx.fillText(author, 257 + 50, 164);
      ctx.fill();
    ctx.font = `bold 30px Arial Black`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "start";
    ctx.fillText(
      "/ " + ConvertToMs(track.info.length),
      670 + ctx.measureText(ConvertToMs(track.info.length)).width - 25,
      164
    );

    ctx.fillStyle = "#ffff";
    ctx.fillText(ConvertToMs(player.position), 630, 164);
    ctx.beginPath();
    ctx.fillStyle = "#484b4E";
    ctx.arc(
      257 + 18.5,
      147.5 + 18.5 + 36.25,
      18.5,
      1.5 * Math.PI,
      0.5 * Math.PI,
      true
    );
    ctx.fill();
    ctx.fillRect(257 + 18.5, 147.5 + 36.25, 615 - 18.5, 37.5);
    ctx.arc(
      257 + 615,
      147.5 + 18.5 + 36.25,
      18.75,
      1.5 * Math.PI,
      0.5 * Math.PI,
      false
    );
    ctx.fill();

    ctx.beginPath();
    // apply color

    ctx.fillStyle = "#24a4ff";

    // progress bar
    ctx.arc(
      257 + 18.5,
      147.5 + 18.5 + 36.25,
      18.5,
      1.5 * Math.PI,
      0.5 * Math.PI,
      true
    );
    ctx.fill();



  ctx.beginPath();
  ctx.fillStyle = bar.track.color;
  ctx.fillRect(30, 40 , 180 + 20 + 10, 180 + 20 + 10);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
    ctx.drawImage(avatar, 35, 45, 180 + 20, 180 + 20);
    ctx.beginPath();
    ctx.arc(
      257 + 18.5,
      147.5 + 18.5 + 36.25,
      18.5,
      1.5 * Math.PI,
      0.5 * Math.PI,
      true
    );
    ctx.fill();
    ctx.fillRect(
      257 + 18.5,
      147.5 + 36.25,
      _calculateProgress(player, track, bar),
      37.5
    );
    ctx.arc(
      257 + 18.5 + _calculateProgress(player, track, bar),
      147.5 + 18.5 + 36.25,
      18.75,
      1.5 * Math.PI,
      0.5 * Math.PI,
      false
    );
    ctx.fill();
    ctx.fillStyle = bar.track.color;
    ctx.fillRect(
      bar.x,
      bar.y,
      _calculateProgress(player, track, bar),
      bar.height
  );
;


    ctx.save();
  ctx.restore();
  return canvas.encode("png");
}
module.exports = { CanvaAlbum, ConvertToMs };
