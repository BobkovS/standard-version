const semver = require('semver');

function versionRegex() {
  return RegExp('<released.version>.+<\/released.version>')
}

function revisionRegex() {
  return RegExp('<revision>.+<\/revision>')
}

function readRevision(contents) {
  const revisionMatches = revisionRegex().exec(contents)
  if (revisionMatches === null) {
    throw new Error('Failed to read the <revision> tag in your pom file - is it present?')
  }
  return String(revisionMatches[0].substring(10, revisionMatches[0].length - 20))
}

module.exports.readVersion = function (contents) {
  const versionMatches = versionRegex().exec(contents)
  if (versionMatches === null) {
    throw new Error('Failed to read the <released.version> tag in your pom file - is it present?')
  }
  return String(versionMatches[0].substring(18, versionMatches[0].length - 19))
}

module.exports.writeVersion = function (contents, version, releaseType) {
  let result = contents.replace(versionRegex(), (match) => {
    return match.replace(/>[^,]+</, `>${version}<`)
  })
  if (releaseType === 'major') {
    const revision = semver.inc(readRevision(result), 'major', '')
    result = result.replace(revisionRegex(), (match) => {
      return match.replace(/>[^,]+</, `>${revision}-SNAPSHOT<`)
    })
  }
  return result
}
