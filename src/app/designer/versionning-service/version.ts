export interface Addition {
  name: string;
  attributes: {
    name: string,
    newValue: any,
  }[];
}

export interface Modification {
  name: string;
  attributes: {
    name: string,
    oldValue: any,
    newValue: any,
  }[];
}

export interface Deletion {
  name: string;
  attributes: {
    name: string,
    oldValue: any,
  }[];
}

export interface Version {
  added: Addition[];
  modified: Modification[];
  deleted: Deletion[];
}
