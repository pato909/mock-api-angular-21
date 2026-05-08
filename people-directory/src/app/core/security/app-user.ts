export class AppUser {
  firstname?: string;
  lastname?: string;
  ssin?: number;
  bce?: number;
  connected : boolean = false;
  admin: boolean = false;
  locale: string = 'nl';
}
