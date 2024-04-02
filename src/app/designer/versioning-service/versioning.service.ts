import {Injectable} from '@angular/core';
import {Addition, Deletion, Modification, Version} from "./version";
import {CommonField} from "../fields/common-field/common-field";
import {ImageField} from "../fields/image-field/image-field";
import {LabelField} from "../fields/label-field/label-field";

/**
 * Service utilisé pour l'historisation des modifications
 */
@Injectable({
  providedIn: 'root'
})
export class VersioningService {

  private versions: Version[] = [];
  private oldFields: CommonField[] = [];

  private currentVersion = -1;

  constructor() {}

  /**
   * Crée une version des champs actuels
   * @param fields Champs à versionner
   */
  public add(fields: CommonField[]): void {
    let oldFieldsChecked: CommonField[] = []

    let version: Version = {
      added: [],
      modified: [],
      deleted: [],
    }

    for (const field of fields) {
      let oldField: CommonField | undefined = this.oldFields.find(oldField => oldField.name == field.name);

      if (oldField) {
        oldFieldsChecked.push(oldField);

        let modification: Modification = this.getModification(oldField, field);

        if (modification.attributes.length > 0) {
          version.modified.push(modification);
        }
      } else {
        let addition: Addition = this.getAddition(field);

        if (addition.attributes.length > 0) {
          version.added.push(addition);
        }
      }
    }

    let deletedFields = this.oldFields.filter(x => !oldFieldsChecked.includes(x));

    for (const deletedField of deletedFields) {
      let deletion = this.getDeletion(deletedField);

      if (deletion.attributes.length > 0) {
        version.deleted.push(deletion);
      }
    }

    if (version.added.length > 0 || version.modified.length > 0 || version.deleted.length > 0) {
      this.versions.length = this.currentVersion+1;
      this.currentVersion++;
      this.versions.push(version);

      this.oldFields = fields.map(field => ({...field}))
    }
  }

  /**
   * Construit l'interface d'effacement pour la version actuelle
   * @param field Champ effacé
   */
  private getDeletion(field: CommonField): Deletion {
    let deletion: Deletion = {
      name: field.name,
      attributes: []
    };

    for (const fieldKey in field) {
      if (fieldKey != "name" && fieldKey != "linkedDirective") {
        deletion.attributes.push({
          name: fieldKey,
          oldValue: field[fieldKey as keyof CommonField]
        });
      }
    }
    return deletion;
  }

  /**
   * Construit l'interface d'ajout pour la version actuelle
   * @param field Champ ajouté
   */
  private getAddition(field: CommonField): Addition {
    let addition: Addition = {
      name: field.name,
      attributes: []
    };

    for (const fieldKey in field) {
      if (fieldKey != "name" && fieldKey != "linkedDirective") {
        addition.attributes.push({
          name: fieldKey,
          newValue: field[fieldKey as keyof CommonField]
        });
      }
    }
    return addition;
  }

  /**
   * Construit l'interface de modification pour la version actuelle
   * @param oldField Champ modifié avec les anciennes valeurs
   * @param field Champ modifié avec les nouvelles valeurs
   */
  private getModification(oldField: CommonField, field: CommonField): Modification {
    let modification: Modification = {
      name: field.name,
      attributes: []
    };

    for (const fieldKey in field) {
      if (fieldKey != "name" && fieldKey != "linkedDirective") {
        if (field[fieldKey as keyof CommonField] != oldField[fieldKey as keyof CommonField]) {
          modification.attributes.push({
            name: fieldKey,
            newValue: field[fieldKey as keyof CommonField],
            oldValue: oldField[fieldKey as keyof CommonField]
          });
        }
      }
    }

    return modification;
  }

  /**
   * Rejoue la dernière modification annulée
   */
  public goBack(): CommonField[] {
    if (!this.canUndo()) {
      return this.oldFields.map(field => ({...field}));
    }

    let newFields = this.oldFields.map(field => ({...field}))

    const version = this.versions.at(this.currentVersion);

    const addedFieldsNames = version!.added.map(addition => addition.name)
    newFields = newFields.filter(oldField => !addedFieldsNames.includes(oldField.name));

    for (const deletion of version!.deleted) {
      let newField: {[key: string] : any} = {
        name: deletion.name
      }

      for (const attribute of deletion.attributes) {
        newField[attribute.name] = attribute.oldValue;
      }

      switch (newField['type']) {
        case 'image':
          newFields.push(<ImageField><unknown>newField);
          break;
        case 'label':
          newFields.push(<LabelField><unknown>newField);
          break;
      }
    }

    for (const modification of version!.modified) {
      let oldField = newFields.find(field => field.name == modification.name);
      let index = newFields.indexOf(oldField!);

      let newField: {[key: string] : any} = {...oldField};
      for (const attribute of modification.attributes) {
        newField[attribute.name] = attribute.oldValue;
      }

      switch (newField['type']) {
        case 'image':
          newFields[index] = <ImageField><unknown>newField;
          break;
        case 'label':
          newFields[index] = <LabelField><unknown>newField;
          break;
      }
    }

    this.oldFields = newFields;
    this.currentVersion--;
    return newFields.map(field => ({...field}));
  }

  /**
   * Annule la dernière modification
   */
  public redo(): CommonField[] {
    if (!this.canRedo()) {
      return this.oldFields.map(field => ({...field}));
    }

    let newFields = this.oldFields.map(field => ({...field}));

    const version = this.versions.at(this.currentVersion+1);

    const deletedFieldsNames = version!.deleted.map(deletion => deletion.name)
    newFields = newFields.filter(oldField => !deletedFieldsNames.includes(oldField.name));

    for (const addition of version!.added) {
      let newField: {[key: string] : any} = {
        name: addition.name
      }

      for (const attribute of addition.attributes) {
        newField[attribute.name] = attribute.newValue;
      }

      switch (newField['type']) {
        case 'image':
          newFields.push(<ImageField><unknown>newField);
          break;
        case 'label':
          newFields.push(<LabelField><unknown>newField);
          break;
      }
    }

    for (const modification of version!.modified) {
      let oldField = newFields.find(field => field.name == modification.name);
      let index = newFields.indexOf(oldField!);

      let newField: {[key: string] : any} = {...oldField};
      for (const attribute of modification.attributes) {
        newField[attribute.name] = attribute.newValue;
      }

      switch (newField['type']) {
        case 'image':
          newFields[index] = <ImageField><unknown>newField;
          break;
        case 'label':
          newFields[index] = <LabelField><unknown>newField;
          break;
      }
    }

    this.oldFields = newFields;
    this.currentVersion++;
    return newFields.map(field => ({...field}));
  }

  /**
   * Vérifie si c'est possible de revenir en arrière
   */
  public canUndo(): boolean {
    return this.currentVersion > -1;
  }

  /**
   * Vérifie si c'est possible de rejouer le retour en arrière
   */
  public canRedo(): boolean {
    return this.currentVersion != this.versions.length - 1;
  }
}
