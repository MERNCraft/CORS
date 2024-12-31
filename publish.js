const { resolve, join } = require('path')

const parent = join(__dirname, "..")
const path = resolve(parent, "MERNCraft.github.io", ".env")
require('dotenv').config({ path })

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

if (!GITHUB_TOKEN) {
  return console.log("npm run publish: COMMAND FAILED.\nGitHub personal access token required. Please:\n* Log in to GitHub.com\n* Visit https://github.com/settings/tokens\n* Generate a classic token with repo privileges\n* Copy the token\n* Create a file called .env inside your MyTutorials.github.io folder (or whatever your 'Xxx.github.io' folder is called)\n* Create an entry in .env like:\n\n  GITHUB_TOKEN=y0ur_p3R50na1_4ce55_T0k3n_G0e5_h3r3\n\n* Save the changes to the .env file\n* Run 'npm run publish' again.\n")
}

const headers = {
  'Accept': 'application/vnd.github+json',
  'Authorization': 'Bearer %'.replace("%", GITHUB_TOKEN),
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
}

const body = JSON.stringify({
  source: {
    "branch":"main",
    "path":"/docs"
  }
})

const URL = "https://api.github.com/repos/MERNCraft/CORS/pages"

fetch(URL, {
  method: 'POST',
  headers,
  body,
})
  .then(response => response.json())
  .then(showResponse)
  .catch(error => console.error("GH-Pages Error:", error));

function showResponse(response) {
  const { status, message, html_url } = response
  if (message) {
    console.log("GitHub Pages says:%n status:  %s%nmessage: %m"
    .replaceAll("%n", "\n")
    .replace("%s", status)
    .replace("%m", message)
    )
  } else {
    console.log(
      "Page will soon be available at %url"
      .replace("%url", html_url)
    )
  }
}
