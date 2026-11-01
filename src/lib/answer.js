function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return row[b.length]
}

export function isMatch(input, answers) {
  const v = normalize(input)
  if (!v) return false
  return answers.some((answer) => {
    const t = normalize(answer)
    if (!t) return false
    if (v === t) return true
    if (t.length >= 3 && v.includes(t)) return true
    return distance(v, t) <= (t.length <= 4 ? 1 : 2)
  })
}
