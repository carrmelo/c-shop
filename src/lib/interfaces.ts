import User from '../models/user.entity';

export interface FileResolved {
  key: string;
  url: string;
}

export interface Id {
  user_id?: string;
  customer_id?: string;
}

export interface CustomerBody {
  name?: string;
  surname?: string;
  createdBy?: User;
  modifiedBy?: User;
  pictureUrl?: string | null;
  pictureKey?: string | null;
}
