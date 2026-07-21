import fs from 'node:fs'

const locales = ['en', 'fa', 'ar', 'tr', 'ru', 'zh']
const data = {}
for (const l of locales) {
  const j = JSON.parse(fs.readFileSync(`src/core/i18n/messages/${l}.json`, 'utf8'))
  delete j.$schema
  data[l] = j
}
const enKeys = Object.keys(data.en)
console.log('en keys', enKeys.length)
for (const l of locales.slice(1)) {
  const keys = Object.keys(data[l])
  const missing = enKeys.filter((k) => !(k in data[l]))
  const extra = keys.filter((k) => !(k in data.en))
  let sameAsEn = 0
  let qmarks = 0
  for (const k of enKeys) {
    if (!(k in data[l])) continue
    const v = String(data[l][k] ?? '')
    if (/\?{2,}/.test(v)) qmarks++
    if (v === data.en[k]) sameAsEn++
  }
  console.log(
    `${l}: keys=${keys.length} missing=${missing.length} extra=${extra.length} sameAsEn=${sameAsEn} qmarks=${qmarks}`,
  )
  if (missing.length) console.log(' missing', missing.join(', '))
}
