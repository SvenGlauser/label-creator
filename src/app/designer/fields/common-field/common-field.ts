import {CommonFieldDirective} from "./common-field.directive";

/**
 * Interface commune pour tous les champs
 */
export interface CommonField {
  name: string;
  type: 'label' | 'image';

  top: number;
  left: number;
  height: number;
  width: number;
  index: number;

  linkedDirective: CommonFieldDirective | undefined;
}
