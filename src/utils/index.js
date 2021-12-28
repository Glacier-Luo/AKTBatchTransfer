export function uakt2akt(uakt, precision = 3) {
  return Math.round((uakt / 1000000 + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision)
}

export function akt2uakt(akt) {
   return Math.round(parseFloat(akt) * 1000000)
}

export async function copy(data) {
  try{
    await navigator.clipboard.writeText(data)
  }catch (e) {
    console.log(e)
  }
}
