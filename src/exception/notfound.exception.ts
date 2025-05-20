export default class EntityNotFoundException extends Error {
  constructor(entity: string, field: string, value: any) {
    super(`${entity} với ${field} = ${value} không tồn tại`);
  }
}
