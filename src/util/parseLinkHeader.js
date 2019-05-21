// Parse Link headers for API pagination.
// https://gist.github.com/niallo/3109252
export default function parseLinkHeader (header) {
  const links = {}

  if (header && header.length) {
    // Split parts by comma
    const parts = header.split(',')
    // Parse each part into a named link
    for (let i = 0; i < parts.length; i++) {
      const section = parts[i].split(';')
      const url = section[0].replace(/<(.*)>/, '$1').trim()
      const name = section[1].replace(/rel="(.*)"/, '$1').trim()
      links[name] = url
    }
  }

  return links
}
