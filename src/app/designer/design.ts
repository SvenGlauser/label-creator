import {DesignCommonDirective} from "./design-common/design-common.directive";

export interface Design {
  name: string;
  type: 'label' | 'image';

  top: number;
  left: number;
  height: number;
  width: number;
  index: number;
  align: 'none' | 'center' | 'left' | 'right';// TODO

  linkedDirective: DesignCommonDirective | undefined;
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
  image?: Blob;
  imageUrl?: string;
  backgroundSize?: 'contain' | 'cover';
}
