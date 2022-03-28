export class UsuarioModel {
  id: number | undefined;
  sex: string | null;
  date_birthday: string | undefined;
  name: string | undefined;
  last_name: string | undefined;
  email: string | undefined;
  addres: string | undefined;
  country: string | null;
  Deparment: string | null;
  City: string | null;
  comment: string | undefined;

  constructor() {
    this.sex = null;
    this.country = null;
    this.Deparment = null;
    this.City = null;
  }
}
