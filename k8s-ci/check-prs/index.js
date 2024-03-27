const { Octokit } = require('@octokit/core')
const lint = require('@commitlint/lint').default
const load = require('@commitlint/load').default
// const commitlint = require('../../commitlint.config')

const OWNER = 'talkdesk'
const REPO = 'conversation-history-portal-app'
const PR_NUMBER = process.env.PR_NUMBER

const getPR = async (octokit) =>
  await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
    owner: OWNER,
    repo: REPO,
    pull_number: PR_NUMBER
  })

async function main() {
  const octokit = new Octokit({
    auth: process.env.AUTH.split(':')[1]
  })

  const pr = await getPR(octokit)
  const prTitle = pr.data.title
  console.log(`The PR name: ${prTitle}`)

  const loadConfig = await load({
    extends: './commitlint.config.js'
  })

  const prTitleVerification = await lint(prTitle, loadConfig.rules, loadConfig)

  if (!prTitleVerification.valid) {
    let message = `Failed to verify PR name:\n`

    const errors = prTitleVerification.errors
    errors.forEach((error) => {
      message += ` - ${error.message}\n`
    })

    console.log(message)
    process.exit(1)
  }

  console.log(`Successful verification of PR name`)
}

main()
