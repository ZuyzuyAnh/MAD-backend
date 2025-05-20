export default class DuplicateEntityException extends Error {
  constructor(entity: string, field: string, value: string) {
    super(`${entity} với ${field} ${value} đã tồn tại`);
  }
}
