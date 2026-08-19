const fs = require('fs');
const path = require('path');

const urls = {
  "DFVMQWByMSi": `https://instagram.fppk1-1.fna.fbcdn.net/v/t51.82787-15/774018388_18084532112322607_5164830916012584946_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzk2NDI4MDk1MjAwNzk5MzkyNA==.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=XMwtMEcQQm0Q7kNvwHzCsvT&_nc_oc=AdpZB2pg2ZG5p-_NvL77S1PjEhBpjFoJTxvDIhYQQjjl3F5AIay6zHppAla0C7K5G6M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fppk1-1.fna&_nc_gid=lH6F1AgSq61pKaPcEJtKCw&_nc_ss=7a22e&oh=00_AQHAyqJZBpR33rtRL-nKnx9g_yfjcXpBOxkGbxOQ4R6o7w&oe=6A878561`,
  "DEy87_eSGns": `https://instagram.fppk1-1.fna.fbcdn.net/v/t51.82787-15/773144674_18083826134322607_146991286175767622_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzk2MjkwMjU4MDI0MTg0ODE0Mg==.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=DRroaLO37noQ7kNvwE-xCqN&_nc_oc=AdqN_yqL57BCMKAaiHY-CQetjlUBaILKSOTUbtcZuj6ph94VjHRx0-83e7RKTJWdavk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fppk1-1.fna&_nc_gid=lH6F1AgSq61pKaPcEJtKCw&_nc_ss=7a22e&oh=00_AQEGRPtVGuj4AjjdSK1i9r-XSEdXAWp1snJ7YJ56HhUkog&oe=6A8779BA`,
  "DEwgaYDy1q1": `https://instagram.fppk1-1.fna.fbcdn.net/v/t51.82787-15/774795145_18083826116322607_3059430242519770625_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=Mzk2MjkwMjU4MTA5NzM3MTg3Nw==.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=xtnilJXC4J8Q7kNvwEI3-aN&_nc_oc=Adpv85IfEGqeHb0K5yKpgl607X2l7a3GmRmWVb4h59RRbqKMhPRSP2Lo9gBRyyw7lP4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fppk1-1.fna&_nc_gid=lH6F1AgSq61pKaPcEJtKCw&_nc_ss=7a22e&oh=00_AQHKjSenJZJIJ2yOUCqJNxNrzWbJuRrosu5mt5vgq-EnkA&oe=6A879E93`,
  "DEuGPMSyQzf": `https://instagram.fppk1-1.fna.fbcdn.net/v/t51.82787-15/773612826_18083826143322607_2778214363784937511_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzk2MjkwMjU4MzgzMDE4MzE4OTY=.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=_rUCAPqVlwcQ7kNvwEcRHOv&_nc_oc=AdoN6pZLsVfNGzsFQna2Uxf5QbYMSsSSdJ5mcgODYWWgsN3etWMOZM6emz5OmXYCnMw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fppk1-1.fna&_nc_gid=lH6F1AgSq61pKaPcEJtKCw&_nc_ss=7a22e&oh=00_AQE6LOVhA5VXiHbrWYLvx02jB7QTJxEy6q1Pqr7KE1-Hhw&oe=6A879A84`,
  "DEnq7dKywzD": `https://instagram.fppk1-1.fna.fbcdn.net/v/t51.82787-15/773271018_18083826131322607_8072957824081728647_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=Mzk2MjkwMjU4MDI4MzczODE0NA==.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=eQs8keJzqcQQ7kNvwFsTLUk&_nc_oc=AdpQoV-eqREOR7bbSPgop1-TksQPyiaMprFlbYfJ612bJMvVI9uxUKgWcAsp1lNWF54&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fppk1-1.fna&_nc_gid=lH6F1AgSq61pKaPcEJtKCw&_nc_ss=7a22e&oh=00_AQEqCgzHtHRHBdByl0BffJvUkuqMgRJVb8q1PPNTVyWJCw&oe=6A879114`,
};

const outputDir = path.join(__dirname, 'public', 'images', 'instagram');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function download(id, url) {
  const dest = path.join(outputDir, `${id}.jpg`);
  console.log(`Downloading ${id}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`Saved ${id} successfully!`);
  } catch (err) {
    console.error(`Failed ${id}: ${err.message}`);
  }
}

async function run() {
  for (const [id, url] of Object.entries(urls)) {
    await download(id, url);
  }
}

run();
