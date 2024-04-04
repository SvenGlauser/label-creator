import {CommonField} from "../common-field/common-field";

/**
 * Interface pour les champs textes classiques
 */
export interface LabelField extends CommonField {
  content: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textAlign: 'center' | 'left' | 'right' | 'justify';
  verticalTextAlign: 'center' | 'flex-end' | 'flex-start';
  color: string;
  backgroundColor: string;
}
