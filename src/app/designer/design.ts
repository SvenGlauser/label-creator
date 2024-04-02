import {CommonFieldDirective} from "./fields/common-field/common-field.directive";

export interface Design {
  name: string;
  type: 'label' | 'image';

  top: number;
  left: number;
  height: number;
  width: number;
  index: number;

  linkedDirective: CommonFieldDirective | undefined;
}

export interface DesignLabel extends Design {
  content: string;
  fontSize: number;
  fontFamily: string;
  textAlign: 'center' | 'left' | 'right' | 'justify';
  verticalTextAlign: 'center' | 'flex-end' | 'flex-start';
  color: string;
  backgroundColor: string;
}

export interface DesignImage extends Design {
  image?: File;
  imageUrl?: string;
  backgroundSize: '' | 'contain' | 'cover';
}

export interface DesignImageExportable extends Design {
  image?: string;
  imageName?: string;
  imageUrl?: string;
  backgroundSize: '' | 'contain' | 'cover';
}
