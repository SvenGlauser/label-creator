import {AbstractControl} from "@angular/forms";
import {Design, DesignImage} from "../design";

export interface DesignPersonalization {
  form?: AbstractControl;

  hasChanged(design: Design, designOld: Design): boolean;

  getNew(design: Design): Design;

  updateForm(design: Design): void;
}
