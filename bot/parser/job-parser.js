const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function parseJob(url) {

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });

  const page = await browser.newPage();

  console.log("\nOpening job:", url);

  try {

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    const title = await page.title();

    const bodyText = await page.locator("body").innerText();

    const skills = [];

    const skillKeywords = [
      "AWS",
      "Terraform",
      "Kubernetes",
      "Docker",
      "CI/CD",
      "Jenkins",
      "SonarQube",
      "Python",
      "Linux",
      "Ansible",
      "Git",
      "Prometheus",
      "Grafana"
    ];

    skillKeywords.forEach(skill => {
      if (bodyText.toLowerCase().includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });

    const jobData = {
      url,
      title,
      skills,
      descriptionLength: bodyText.length,
      scrapedAt: new Date().toISOString()
    };

    console.log("\nParsed Job Data:");
    console.log(jobData);

    const dataDir = path.join(__dirname, "../../data");
    const dataFile = path.join(dataDir, "jobs.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    let jobs = [];

    if (fs.existsSync(dataFile)) {
      jobs = JSON.parse(fs.readFileSync(dataFile));
    }

    const exists = jobs.find(j => j.url === url);

    if (!exists) {

      jobs.push(jobData);

      fs.writeFileSync(
        dataFile,
        JSON.stringify(jobs, null, 2)
      );

      console.log("\nJob saved to data/jobs.json");

    } else {

      console.log("\nJob already exists in database");

    }

  } catch (error) {

    console.log("\nFailed to open job:", url);
    console.log(error.message);

  }

  await browser.close();
}

const jobUrl = process.argv[2];

if (!jobUrl || !jobUrl.startsWith("http")) {

  console.log("\nUsage:");
  console.log('node bot/parser/job-parser.js "https://job-url"');

  process.exit();

}

parseJob(jobUrl);
