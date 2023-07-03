const unFormatValue = (value: any) => +value.toString().replace(/,/g, '').replace('$', '')
const pack = (list: Partial<{ id: string }>[]) => JSON.stringify(list.map((item) => item.id))
const unpack = (packed: string): string[] => JSON.parse(packed)

export { unFormatValue, pack, unpack }
