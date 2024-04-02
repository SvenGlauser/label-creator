import {CommonFieldDirective} from "./fields/common-field/common-field.directive";

export interface Field {
  name: string;
  type: 'label' | 'image';

  top: number;
  left: number;
  height: number;
  width: number;
  index: number;

  linkedDirective: CommonFieldDirective | undefined;
}

export interface LabelField extends Field {
  content: string;
  fontSize: number;
  fontFamily: string;
  textAlign: 'center' | 'left' | 'right' | 'justify';
  verticalTextAlign: 'center' | 'flex-end' | 'flex-start';
  color: string;
  backgroundColor: string;
}

export interface ImageField extends Field {
  image?: File;
  imageUrl?: string;
  backgroundSize: '' | 'contain' | 'cover';
}

export interface ImageFieldExportable extends Field {
  image?: string;
  imageName?: string;
  imageUrl?: string;
  backgroundSize: '' | 'contain' | 'cover';
}
