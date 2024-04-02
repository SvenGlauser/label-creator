import {Injectable} from '@angular/core';
import {Addition, Deletion, Modification, Version} from "./version";
import {Design, DesignImage, DesignLabel} from "../design";

@Injectable({
  providedIn: 'root'
})
export class VersionningService {

  private versions: Version[] = [];
  private oldList: Design[] = [];

  private currentVersion = -1;

  constructor() {}

  public add(designs: Design[]): void {
    let oldDesignsChecked: Design[] = []

    let version: Version = {
      added: [],
      modified: [],
      deleted: [],
    }

    for (const design of designs) {
      let oldDesign = this.oldList.find(oldDesign => oldDesign.name == design.name);

      if (!!oldDesign) {
        oldDesignsChecked.push(oldDesign);

        let modification: Modification = {
          name: design.name,
          attributes: []
        };

        for (const designKey in design) {
          if (designKey != "name" && designKey != "linkedDirective") {
            if (design[designKey as keyof Design] != oldDesign[designKey as keyof Design]) {
              modification.attributes.push({
                name: designKey,
                newValue: design[designKey as keyof Design],
                oldValue: oldDesign[designKey as keyof Design]
              });
            }
          }
        }

        if (modification.attributes.length > 0) {
          version.modified.push(modification);
        }
      } else {
        let addition: Addition = {
          name: design.name,
          attributes: []
        };

        for (const designKey in design) {
          if (designKey != "name" && designKey != "linkedDirective") {
            addition.attributes.push({
              name: designKey,
              newValue: design[designKey as keyof Design]
            });
          }
        }

        if (addition.attributes.length > 0) {
          version.added.push(addition);
        }
      }
    }

    let elementsDeleted = this.oldList.filter(x => !oldDesignsChecked.includes(x));

    for (const design of elementsDeleted) {
      let deletion: Deletion = {
        name: design.name,
        attributes: []
      };

      for (const designKey in design) {
        if (designKey != "name" && designKey != "linkedDirective") {
          deletion.attributes.push({
            name: designKey,
            oldValue: design[designKey as keyof Design]
          });
        }
      }

      if (deletion.attributes.length > 0) {
        version.deleted.push(deletion);
      }
    }

    if (version.added.length > 0 || version.modified.length > 0 || version.deleted.length > 0) {
      this.versions.length = this.currentVersion+1;
      this.currentVersion++;
      this.versions.push(version);

      this.oldList = designs.map(design => ({...design}))
    }
  }

  public goBack(): Design[] {
    if (!this.canGoBack()) {
      return this.oldList.map(design => ({...design}));
    }

    let newList = this.oldList.map(design => ({...design}))

    const version = this.versions.at(this.currentVersion);

    const additionNameList = version!.added.map(addition => addition.name)
    newList = newList.filter(oldDesign => !additionNameList.includes(oldDesign.name));

    for (const deletion of version!.deleted) {
      let newDesign: {[key: string] : any} = {
        name: deletion.name
      }

      for (const attribute of deletion.attributes) {
        newDesign[attribute.name] = attribute.oldValue;
      }

      switch (newDesign['type']) {
        case 'image':
          newList.push(<DesignImage><unknown>newDesign);
          break;
        case 'label':
          newList.push(<DesignLabel><unknown>newDesign);
          break;
      }
    }

    for (const modification of version!.modified) {
      let oldDesign = newList.find(design => design.name == modification.name);
      let index = newList.indexOf(oldDesign!);

      let newDesign: {[key: string] : any} = {...oldDesign};
      for (const attribute of modification.attributes) {
        newDesign[attribute.name] = attribute.oldValue;
      }

      switch (newDesign['type']) {
        case 'image':
          newList[index] = <DesignImage><unknown>newDesign;
          break;
        case 'label':
          newList[index] = <DesignLabel><unknown>newDesign;
          break;
      }
    }

    this.oldList = newList;
    this.currentVersion--;
    return newList.map(design => ({...design}));
  }

  public goNext(): Design[] {
    if (!this.canGoNext()) {
      return this.oldList.map(design => ({...design}));
    }

    let newList = this.oldList.map(design => ({...design}))

    const version = this.versions.at(this.currentVersion+1);

    const deletionNameList = version!.deleted.map(deletion => deletion.name)
    newList = newList.filter(oldDesign => !deletionNameList.includes(oldDesign.name));

    for (const addition of version!.added) {
      let newDesign: {[key: string] : any} = {
        name: addition.name
      }

      for (const attribute of addition.attributes) {
        newDesign[attribute.name] = attribute.newValue;
      }

      switch (newDesign['type']) {
        case 'image':
          newList.push(<DesignImage><unknown>newDesign);
          break;
        case 'label':
          newList.push(<DesignLabel><unknown>newDesign);
          break;
      }
    }

    for (const modification of version!.modified) {
      let oldDesign = newList.find(design => design.name == modification.name);
      let index = newList.indexOf(oldDesign!);

      let newDesign: {[key: string] : any} = {...oldDesign};
      for (const attribute of modification.attributes) {
        newDesign[attribute.name] = attribute.newValue;
      }

      switch (newDesign['type']) {
        case 'image':
          newList[index] = <DesignImage><unknown>newDesign;
          break;
        case 'label':
          newList[index] = <DesignLabel><unknown>newDesign;
          break;
      }
    }

    this.oldList = newList;
    this.currentVersion++;
    return newList.map(design => ({...design}));
  }

  public canGoBack(): boolean {
    return this.currentVersion > -1;
  }

  public canGoNext(): boolean {
    return this.currentVersion != this.versions.length - 1;
  }
}
